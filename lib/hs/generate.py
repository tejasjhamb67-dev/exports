#!/usr/bin/env python3
# ============================================================
#  HS TAXONOMY + INDIA TRADE GENERATOR  (ENGINEERING_PLAN.md · step 1)
#
#  Emits lib/hs/hs.json — the HS-2 -> HS-4 tree with, per node:
#    - official HS 2022 description (taxonomy is public/stable -> 'official')
#    - India FY25 export value (US$M)               -> 'estimate' (DGCIS-scale)
#    - supply-state profile (share %, geo.ts keys)  -> 'derived' (cluster model)
#    - top destinations (US$M, geo.ts keys)         -> 'estimate'
#    - global import (US$B), India share %, CAGR %   -> 'estimate'
#    - white-space tier (A/B/C) + score              -> derived from share x growth
#
#  Data-honesty rules (plan §5): the HS *nomenclature* is official; every
#  India-specific figure is a screening-grade estimate or a derived split,
#  tagged as such and rendered as such in the UI. No estimate is dressed up
#  as an official statistic.
#
#  Live sourcing (WCO HS list, UN Comtrade, DGCIS) is blocked by the session
#  egress policy, so the reference tables below are embedded from published
#  aggregates. HS-4 coverage is curated to the headings that actually carry
#  India's export value (India-centric, per the locked scope) rather than a
#  fabricated full 1,224-line enumeration.
# ============================================================
import json, os, datetime

# ---- 21 HS sections (chapter range -> roman numeral + title) ----------------
SECTIONS = [
    ("I",    "Live animals & animal products",        range(1, 6)),
    ("II",   "Vegetable products",                    range(6, 15)),
    ("III",  "Animal/vegetable fats & oils",          range(15, 16)),
    ("IV",   "Prepared foodstuffs; beverages; tobacco",range(16, 25)),
    ("V",    "Mineral products",                       range(25, 28)),
    ("VI",   "Chemical & allied products",             range(28, 39)),
    ("VII",  "Plastics & rubber",                      range(39, 41)),
    ("VIII", "Raw hides, leather & furskins",          range(41, 44)),
    ("IX",   "Wood, cork & straw",                     range(44, 47)),
    ("X",    "Pulp, paper & printed products",         range(47, 50)),
    ("XI",   "Textiles & textile articles",            range(50, 64)),
    ("XII",  "Footwear, headgear & umbrellas",         range(64, 68)),
    ("XIII", "Stone, ceramic & glass",                 range(68, 71)),
    ("XIV",  "Pearls, precious stones & metals",       range(71, 72)),
    ("XV",   "Base metals & articles thereof",         range(72, 84)),
    ("XVI",  "Machinery & electrical equipment",       range(84, 86)),
    ("XVII", "Vehicles, aircraft & vessels",           range(86, 90)),
    ("XVIII","Optical, medical & precision instruments",range(90, 93)),
    ("XIX",  "Arms & ammunition",                      range(93, 94)),
    ("XX",   "Miscellaneous manufactured articles",    range(94, 97)),
    ("XXI",  "Works of art & antiques",                range(97, 98)),
]

def section_of(ch:int):
    for rn, title, rng in SECTIONS:
        if ch in rng:
            return rn, title
    return "", ""

# ---- 96 HS chapters (official HS 2022 titles) --------------------------------
CHAPTERS = {
 "01":"Live animals",
 "02":"Meat and edible meat offal",
 "03":"Fish and crustaceans, molluscs and other aquatic invertebrates",
 "04":"Dairy produce; birds' eggs; natural honey; edible products of animal origin, n.e.s.",
 "05":"Products of animal origin, not elsewhere specified or included",
 "06":"Live trees and other plants; bulbs, roots; cut flowers and ornamental foliage",
 "07":"Edible vegetables and certain roots and tubers",
 "08":"Edible fruit and nuts; peel of citrus fruit or melons",
 "09":"Coffee, tea, maté and spices",
 "10":"Cereals",
 "11":"Products of the milling industry; malt; starches; inulin; wheat gluten",
 "12":"Oil seeds and oleaginous fruits; miscellaneous grains, seeds and fruit; industrial or medicinal plants; straw and fodder",
 "13":"Lac; gums, resins and other vegetable saps and extracts",
 "14":"Vegetable plaiting materials; vegetable products n.e.s.",
 "15":"Animal, vegetable or microbial fats and oils; prepared edible fats; waxes",
 "16":"Preparations of meat, fish, crustaceans, molluscs or other aquatic invertebrates, or of insects",
 "17":"Sugars and sugar confectionery",
 "18":"Cocoa and cocoa preparations",
 "19":"Preparations of cereals, flour, starch or milk; pastrycooks' products",
 "20":"Preparations of vegetables, fruit, nuts or other parts of plants",
 "21":"Miscellaneous edible preparations",
 "22":"Beverages, spirits and vinegar",
 "23":"Residues and waste from the food industries; prepared animal fodder",
 "24":"Tobacco and manufactured tobacco substitutes",
 "25":"Salt; sulphur; earths and stone; plastering materials, lime and cement",
 "26":"Ores, slag and ash",
 "27":"Mineral fuels, mineral oils and products of their distillation; bituminous substances; mineral waxes",
 "28":"Inorganic chemicals; compounds of precious metals, rare-earth metals, radioactive elements or isotopes",
 "29":"Organic chemicals",
 "30":"Pharmaceutical products",
 "31":"Fertilisers",
 "32":"Tanning or dyeing extracts; dyes, pigments; paints, varnishes; inks",
 "33":"Essential oils and resinoids; perfumery, cosmetic or toilet preparations",
 "34":"Soap, surface-active agents, washing/lubricating preparations, waxes, candles, dental preparations",
 "35":"Albuminoidal substances; modified starches; glues; enzymes",
 "36":"Explosives; pyrotechnic products; matches; pyrophoric alloys; combustible preparations",
 "37":"Photographic or cinematographic goods",
 "38":"Miscellaneous chemical products",
 "39":"Plastics and articles thereof",
 "40":"Rubber and articles thereof",
 "41":"Raw hides and skins (other than furskins) and leather",
 "42":"Articles of leather; saddlery; travel goods, handbags; articles of animal gut",
 "43":"Furskins and artificial fur; manufactures thereof",
 "44":"Wood and articles of wood; wood charcoal",
 "45":"Cork and articles of cork",
 "46":"Manufactures of straw, esparto or other plaiting materials; basketware and wickerwork",
 "47":"Pulp of wood or of other fibrous cellulosic material; recovered paper or paperboard",
 "48":"Paper and paperboard; articles of paper pulp, of paper or of paperboard",
 "49":"Printed books, newspapers, pictures and other products of the printing industry",
 "50":"Silk",
 "51":"Wool, fine or coarse animal hair; horsehair yarn and woven fabric",
 "52":"Cotton",
 "53":"Other vegetable textile fibres; paper yarn and woven fabrics of paper yarn",
 "54":"Man-made filaments; strip and the like of man-made textile materials",
 "55":"Man-made staple fibres",
 "56":"Wadding, felt and nonwovens; special yarns; twine, cordage, ropes and cables",
 "57":"Carpets and other textile floor coverings",
 "58":"Special woven fabrics; tufted textile fabrics; lace; tapestries; trimmings; embroidery",
 "59":"Impregnated, coated, covered or laminated textile fabrics; textile articles for industrial use",
 "60":"Knitted or crocheted fabrics",
 "61":"Articles of apparel and clothing accessories, knitted or crocheted",
 "62":"Articles of apparel and clothing accessories, not knitted or crocheted",
 "63":"Other made-up textile articles; sets; worn clothing and worn textile articles; rags",
 "64":"Footwear, gaiters and the like; parts of such articles",
 "65":"Headgear and parts thereof",
 "66":"Umbrellas, walking-sticks, seat-sticks, whips and parts thereof",
 "67":"Prepared feathers and down; artificial flowers; articles of human hair",
 "68":"Articles of stone, plaster, cement, asbestos, mica or similar materials",
 "69":"Ceramic products",
 "70":"Glass and glassware",
 "71":"Natural or cultured pearls, precious stones, precious metals and articles thereof; imitation jewellery; coin",
 "72":"Iron and steel",
 "73":"Articles of iron or steel",
 "74":"Copper and articles thereof",
 "75":"Nickel and articles thereof",
 "76":"Aluminium and articles thereof",
 "78":"Lead and articles thereof",
 "79":"Zinc and articles thereof",
 "80":"Tin and articles thereof",
 "81":"Other base metals; cermets; articles thereof",
 "82":"Tools, implements, cutlery, spoons and forks, of base metal",
 "83":"Miscellaneous articles of base metal",
 "84":"Nuclear reactors, boilers, machinery and mechanical appliances; parts thereof",
 "85":"Electrical machinery and equipment and parts thereof; sound/television recorders and reproducers",
 "86":"Railway or tramway locomotives, rolling-stock and parts; track fixtures; signalling equipment",
 "87":"Vehicles other than railway or tramway rolling-stock, and parts and accessories thereof",
 "88":"Aircraft, spacecraft, and parts thereof",
 "89":"Ships, boats and floating structures",
 "90":"Optical, photographic, measuring, checking, precision, medical or surgical instruments",
 "91":"Clocks and watches and parts thereof",
 "92":"Musical instruments; parts and accessories of such articles",
 "93":"Arms and ammunition; parts and accessories thereof",
 "94":"Furniture; bedding, mattresses; luminaires and lighting fittings; prefabricated buildings",
 "95":"Toys, games and sports requisites; parts and accessories thereof",
 "96":"Miscellaneous manufactured articles",
 "97":"Works of art, collectors' pieces and antiques",
}

# ---- India FY25 merchandise export by chapter (US$M, screening estimate) -----
# Scaled to India's ~US$437B goods total; DGCIS-order-of-magnitude, not a quote.
CHAP_EXPORT = {
 "27":84000,"71":32000,"30":27500,"85":27000,"84":24000,"29":22000,"87":21000,
 "72":15500,"10":12000,"73":10500,"03":7600,"52":7200,"39":8200,"62":8000,
 "61":7500,"88":2600,"90":6000,"76":5600,"38":5200,"40":4200,"09":4400,
 "08":3400,"07":3200,"17":3600,"23":3200,"63":3000,"69":2400,"64":2600,
 "12":2800,"15":2400,"25":2600,"32":2600,"33":2400,"42":2000,"55":1800,
 "54":2100,"20":1900,"16":1500,"48":1900,"94":1600,"96":900,"22":1400,
 "24":1200,"34":1400,"28":2200,"31":900,"19":1400,"21":1300,"04":900,
 "13":700,"18":260,"11":600,"56":900,"57":1600,"58":700,"59":900,"60":800,
 "68":1100,"70":2000,"74":2200,"75":180,"78":220,"79":260,"80":90,"81":300,
 "82":1400,"83":1500,"41":600,"43":90,"44":600,"45":20,"46":140,"47":220,
 "49":1200,"50":140,"51":260,"53":260,"65":180,"66":120,"67":90,"86":900,
 "89":1400,"91":120,"92":90,"93":900,"95":600,"97":260,"01":900,"02":3600,
 "05":700,"06":320,"14":140,"26":900,"35":700,"36":260,"37":180,
}

# ---- supply-state cluster archetypes (geo.ts keys -> share %) -----------------
# 'derived': India does not publish HS-4 state splits, so each chapter inherits
# a cluster profile built from known industrial geography (ports, clusters, PLI).
SUPPLY = {
 "petro":   [("Gujarat",55),("Maharashtra",12),("Tamil Nadu",8),("Odisha",6),("Andhra Pradesh",5),("Karnataka",5),("West Bengal",5),("Assam",4)],
 "chem":    [("Gujarat",45),("Maharashtra",22),("Tamil Nadu",10),("Andhra Pradesh",8),("Telangana",7),("Karnataka",5),("Gujarat",3)][:6],
 "pharma":  [("Telangana",22),("Gujarat",20),("Maharashtra",18),("Himachal Pradesh",10),("Karnataka",9),("Andhra Pradesh",9),("Uttarakhand",7),("Sikkim",5)],
 "gems":    [("Gujarat",55),("Maharashtra",35),("Rajasthan",5),("West Bengal",3),("Tamil Nadu",2)],
 "textile": [("Tamil Nadu",28),("Gujarat",20),("Maharashtra",14),("Punjab",10),("Karnataka",8),("Rajasthan",7),("West Bengal",7),("Uttar Pradesh",6)],
 "apparel": [("Tamil Nadu",26),("Karnataka",18),("Delhi",14),("Haryana",10),("Uttar Pradesh",9),("Maharashtra",8),("Rajasthan",8),("Punjab",7)],
 "marine":  [("Andhra Pradesh",32),("Gujarat",14),("Tamil Nadu",12),("Kerala",12),("West Bengal",10),("Odisha",8),("Maharashtra",6),("Karnataka",6)],
 "agri":    [("Uttar Pradesh",18),("Punjab",14),("Haryana",12),("Andhra Pradesh",12),("Gujarat",10),("West Bengal",9),("Maharashtra",9),("Telangana",6),("Madhya Pradesh",6),("Karnataka",4)],
 "spice":   [("Kerala",22),("Andhra Pradesh",18),("Gujarat",14),("Tamil Nadu",12),("Karnataka",12),("Rajasthan",8),("Maharashtra",8),("Madhya Pradesh",6)],
 "machine": [("Maharashtra",26),("Tamil Nadu",18),("Gujarat",14),("Karnataka",12),("Haryana",10),("Delhi",6),("Uttar Pradesh",6),("Telangana",4),("Punjab",4)],
 "elec":    [("Tamil Nadu",24),("Uttar Pradesh",18),("Karnataka",14),("Maharashtra",12),("Andhra Pradesh",9),("Gujarat",8),("Delhi",7),("Haryana",4),("Telangana",4)],
 "auto":    [("Tamil Nadu",24),("Maharashtra",20),("Haryana",16),("Gujarat",12),("Karnataka",10),("Uttarakhand",6),("Rajasthan",5),("Uttar Pradesh",4),("Madhya Pradesh",3)],
 "steel":   [("Odisha",18),("Jharkhand",14),("Chhattisgarh",12),("Maharashtra",12),("Gujarat",11),("Karnataka",10),("West Bengal",8),("Tamil Nadu",7),("Telangana",4),("Goa",4)],
 "ceramic": [("Gujarat",68),("Rajasthan",8),("Tamil Nadu",7),("Maharashtra",6),("Uttar Pradesh",5),("Andhra Pradesh",3),("Punjab",3)],
 "leather": [("Tamil Nadu",42),("Uttar Pradesh",22),("West Bengal",14),("Punjab",6),("Karnataka",6),("Maharashtra",5),("Haryana",5)],
 "plastic": [("Gujarat",34),("Maharashtra",22),("Tamil Nadu",12),("Delhi",9),("Dadra and Nagar Haveli and Daman and Diu",7),("Karnataka",7),("Uttar Pradesh",5),("Haryana",4)],
 "metalore":[("Odisha",34),("Karnataka",16),("Chhattisgarh",12),("Jharkhand",12),("Goa",10),("Rajasthan",8),("Andhra Pradesh",8)],
 "generic": [("Maharashtra",22),("Gujarat",20),("Tamil Nadu",14),("Karnataka",10),("Uttar Pradesh",9),("Delhi",8),("Haryana",7),("West Bengal",6),("Telangana",4)],
}

# ---- destination archetypes (geo.ts keys -> weight) --------------------------
DEST = {
 "us_led":  [("United States of America",30),("United Arab Emirates",12),("Netherlands",6),("United Kingdom",6),("Germany",5),("China",5),("Bangladesh",4),("Saudi Arabia",4)],
 "pharma":  [("United States of America",34),("United Kingdom",6),("South Africa",5),("Nigeria",5),("Brazil",4),("Germany",4),("Australia",3),("Netherlands",3),("Russia",3)],
 "gems":    [("United States of America",28),("United Arab Emirates",24),("Belgium",8),("Israel",6),("United Kingdom",6),("China",6),("Thailand",4)],
 "petro":   [("Netherlands",16),("United Arab Emirates",10),("United States of America",9),("Brazil",6),("China",6),("South Africa",5),("Turkey",5),("Australia",4)],
 "marine":  [("United States of America",34),("China",20),("Japan",8),("Vietnam",8),("Thailand",6),("United Arab Emirates",4),("United Kingdom",4)],
 "rice":    [("United Arab Emirates",14),("Saudi Arabia",12),("Iran",10),("Iraq",8),("United States of America",7),("Bangladesh",6),("Benin",5),("Nigeria",5)],
 "textile": [("United States of America",28),("United Kingdom",8),("United Arab Emirates",8),("Germany",6),("Bangladesh",6),("France",5),("Netherlands",4),("Spain",4),("Italy",4)],
 "auto":    [("United States of America",24),("Germany",8),("United Kingdom",6),("Mexico",6),("Bangladesh",5),("United Arab Emirates",5),("Turkey",5),("Brazil",4),("Nepal",4),("Italy",3)],
 "machine": [("United States of America",26),("Germany",7),("United Arab Emirates",6),("United Kingdom",5),("China",4),("Nepal",4),("Mexico",4),("Saudi Arabia",4),("Bangladesh",3)],
 "ceramic": [("United States of America",18),("Saudi Arabia",12),("United Arab Emirates",10),("Iraq",8),("United Kingdom",6),("Mexico",5),("Israel",4),("Poland",4)],
 "generic": [("United States of America",22),("United Arab Emirates",10),("China",8),("Netherlands",6),("United Kingdom",5),("Germany",5),("Bangladesh",4),("Saudi Arabia",4),("Nepal",3)],
}

# ---- chapter -> (supply archetype, dest archetype, globalImport US$B, cagr%) --
# globalImport = world import scale for the chapter; cagr = est. 5y demand CAGR.
PROFILE = {
 "01":("agri","generic",22,3),"02":("agri","us_led",120,4),"03":("marine","marine",165,5),
 "04":("agri","generic",95,4),"05":("agri","generic",14,3),"06":("agri","generic",28,4),
 "07":("agri","rice",95,4),"08":("agri","us_led",120,5),"09":("spice","us_led",120,5),
 "10":("agri","rice",115,4),"11":("agri","generic",30,4),"12":("agri","generic",190,4),
 "13":("spice","generic",9,5),"14":("agri","generic",3,3),"15":("agri","generic",150,4),
 "16":("marine","us_led",60,5),"17":("agri","rice",55,3),"18":("agri","generic",50,4),
 "19":("agri","us_led",70,5),"20":("agri","us_led",90,5),"21":("agri","us_led",55,6),
 "22":("agri","us_led",190,5),"23":("agri","generic",70,4),"24":("agri","generic",55,3),
 "25":("chem","generic",70,4),"26":("metalore","petro",320,3),"27":("petro","petro",2400,3),
 "28":("chem","us_led",140,5),"29":("chem","us_led",620,6),"30":("pharma","pharma",720,8),
 "31":("chem","generic",130,4),"32":("chem","us_led",90,5),"33":("chem","us_led",95,7),
 "34":("chem","generic",70,5),"35":("chem","us_led",45,6),"36":("chem","generic",18,6),
 "37":("chem","generic",12,2),"38":("chem","us_led",260,6),"39":("plastic","us_led",760,5),
 "40":("plastic","auto",240,5),"41":("leather","us_led",25,2),"42":("leather","us_led",70,5),
 "43":("leather","generic",14,2),"44":("generic","us_led",160,3),"45":("generic","generic",2,3),
 "46":("generic","us_led",4,4),"47":("generic","generic",75,3),"48":("generic","generic",220,3),
 "49":("generic","us_led",45,2),"50":("textile","us_led",18,3),"51":("textile","us_led",35,3),
 "52":("textile","textile",130,4),"53":("textile","generic",5,3),"54":("textile","textile",70,4),
 "55":("textile","textile",60,4),"56":("textile","us_led",55,5),"57":("textile","us_led",18,4),
 "58":("textile","us_led",14,4),"59":("textile","machine",30,6),"60":("textile","textile",30,4),
 "61":("apparel","textile",290,5),"62":("apparel","textile",290,5),"63":("apparel","textile",70,5),
 "64":("leather","us_led",170,5),"65":("apparel","us_led",9,4),"66":("generic","us_led",5,4),
 "67":("generic","us_led",4,4),"68":("ceramic","ceramic",55,5),"69":("ceramic","ceramic",70,5),
 "70":("ceramic","us_led",95,5),"71":("gems","gems",620,6),"72":("steel","generic",520,3),
 "73":("steel","us_led",300,4),"74":("steel","machine",200,4),"75":("steel","machine",45,3),
 "76":("steel","us_led",270,5),"78":("steel","generic",30,3),"79":("steel","generic",35,3),
 "80":("steel","generic",12,3),"81":("steel","machine",40,5),"82":("machine","us_led",90,4),
 "83":("machine","us_led",90,4),"84":("machine","machine",2400,5),"85":("elec","machine",3400,6),
 "86":("machine","machine",70,4),"87":("auto","auto",1500,6),"88":("machine","us_led",320,6),
 "89":("steel","generic",130,3),"90":("elec","pharma",720,7),"91":("elec","us_led",70,4),
 "92":("generic","us_led",14,3),"93":("machine","generic",30,7),"94":("generic","us_led",280,5),
 "95":("plastic","us_led",190,5),"96":("plastic","us_led",90,5),"97":("gems","us_led",30,3),
}

# ---- curated real HS-4 headings for India's material export chapters ----------
# code -> (description, weight%).  weight = rough intra-chapter share of India
# export; used only to split the chapter estimate across headings (est.).
HS4 = {
 # 03 fish
 "03":[("0306","Crustaceans (shrimp, prawns, lobster, crab), whether or not in shell",64),
       ("0304","Fish fillets and other fish meat, fresh, chilled or frozen",12),
       ("0303","Fish, frozen (excluding fillets)",12),
       ("0307","Molluscs (cuttlefish, squid, octopus), whether or not in shell",8),
       ("0302","Fish, fresh or chilled (excluding fillets)",4)],
 # 09 spices
 "09":[("0904","Pepper; fruits of genus Capsicum or Pimenta (chilli)",34),
       ("0908","Nutmeg, mace and cardamoms",14),
       ("0909","Seeds of anise, coriander, cumin, caraway, fennel; juniper berries",22),
       ("0910","Ginger, saffron, turmeric, thyme, bay leaves, curry and other spices",22),
       ("0902","Tea, whether or not flavoured",8)],
 # 10 cereals
 "10":[("1006","Rice",78),("1001","Wheat and meslin",10),("1005","Maize (corn)",8),
       ("1007","Grain sorghum",2),("1008","Buckwheat, millet, canary seeds and other cereals",2)],
 # 16 prepared meat/fish
 "16":[("1605","Crustaceans, molluscs and other aquatic invertebrates, prepared or preserved",56),
       ("1604","Prepared or preserved fish; caviar",30),
       ("1602","Other prepared or preserved meat, meat offal, blood or insects",10),
       ("1601","Sausages and similar products of meat, meat offal, blood or insects",4)],
 # 27 mineral fuels
 "27":[("2710","Petroleum oils, other than crude (refined products)",82),
       ("2709","Petroleum oils, crude",6),
       ("2711","Petroleum gases and other gaseous hydrocarbons",5),
       ("2713","Petroleum coke, petroleum bitumen and other residues",4),
       ("2701","Coal; briquettes and similar solid fuels manufactured from coal",3)],
 # 28 inorganic chem
 "28":[("2804","Hydrogen, rare gases and other non-metals",10),
       ("2827","Chlorides, chloride oxides and hydroxides; bromides, iodides",12),
       ("2833","Sulphates; alums; peroxosulphates",10),
       ("2836","Carbonates; peroxocarbonates",10),
       ("2841","Salts of oxometallic or peroxometallic acids",10),
       ("2842","Other salts of inorganic acids or peroxoacids",12),
       ("2818","Artificial corundum; aluminium oxide; aluminium hydroxide",18),
       ("2811","Other inorganic acids and inorganic oxygen compounds of non-metals",18)],
 # 29 organic chem
 "29":[("2933","Heterocyclic compounds with nitrogen hetero-atom(s) only",16),
       ("2934","Nucleic acids and their salts; other heterocyclic compounds",10),
       ("2942","Other organic compounds",8),
       ("2932","Heterocyclic compounds with oxygen hetero-atom(s) only",8),
       ("2941","Antibiotics",8),
       ("2914","Ketones and quinones",6),
       ("2915","Saturated acyclic monocarboxylic acids and their derivatives",8),
       ("2916","Unsaturated acyclic / cyclic monocarboxylic acids and derivatives",6),
       ("2921","Amine-function compounds",8),
       ("2922","Oxygen-function amino-compounds",8),
       ("2905","Acyclic alcohols and their derivatives",6),
       ("2918","Carboxylic acids with additional oxygen function and derivatives",8)],
 # 30 pharma
 "30":[("3004","Medicaments, in measured doses or for retail sale",60),
       ("3003","Medicaments, not in measured doses or for retail sale",8),
       ("3002","Human/animal blood; antisera, vaccines, toxins, cultures; blood fractions",16),
       ("3006","Pharmaceutical goods (sutures, dressings, kits, contraceptives)",8),
       ("3005","Wadding, gauze, bandages and similar articles",4),
       ("3001","Glands and other organs; heparin; human/animal substances for therapy",4)],
 # 32 dyes/pigments
 "32":[("3204","Synthetic organic colouring matter; dyes and pigments",42),
       ("3206","Other colouring matter; inorganic pigments",16),
       ("3208","Paints and varnishes based on synthetic polymers (non-aqueous)",14),
       ("3212","Pigments dispersed in non-aqueous media; dyes for retail",8),
       ("3202","Synthetic organic tanning substances; tanning preparations",12),
       ("3215","Printing ink, writing or drawing ink and other inks",8)],
 # 33 essential oils / cosmetics
 "33":[("3304","Beauty, make-up and skin-care preparations; sunscreens; manicure",30),
       ("3305","Preparations for use on the hair",16),
       ("3303","Perfumes and toilet waters",10),
       ("3301","Essential oils; resinoids; concentrates of essential oils",18),
       ("3307","Pre-shave, shaving, deodorants, bath preparations",14),
       ("3306","Preparations for oral or dental hygiene",12)],
 # 38 misc chemical
 "38":[("3808","Insecticides, fungicides, herbicides, disinfectants (retail forms)",34),
       ("3824","Prepared binders; chemical products and preparations n.e.s.",22),
       ("3822","Diagnostic or laboratory reagents; certified reference materials",14),
       ("3826","Biodiesel and mixtures thereof",8),
       ("3812","Rubber compounding accelerators; anti-oxidants; plasticisers",10),
       ("3814","Organic composite solvents and thinners",12)],
 # 39 plastics
 "39":[("3901","Polymers of ethylene, in primary forms",12),
       ("3902","Polymers of propylene or of other olefins, in primary forms",8),
       ("3907","Polyacetals, polyethers, epoxide resins, polyesters (primary forms)",14),
       ("3920","Other plates, sheets, film, foil of plastics, non-cellular",16),
       ("3923","Articles for the conveyance or packing of goods, of plastics",18),
       ("3926","Other articles of plastics",22),
       ("3919","Self-adhesive plates, sheets, film, foil of plastics",10)],
 # 40 rubber
 "40":[("4011","New pneumatic tyres, of rubber",44),
       ("4016","Other articles of vulcanised rubber (other than hard rubber)",20),
       ("4002","Synthetic rubber and factice, in primary forms",10),
       ("4009","Tubes, pipes and hoses of vulcanised rubber",10),
       ("4008","Plates, sheets, strip, rods and profile shapes of rubber",8),
       ("4001","Natural rubber, balata, gutta-percha, in primary forms",8)],
 # 42 leather goods
 "42":[("4202","Trunks, suitcases, handbags, wallets and similar containers",64),
       ("4203","Articles of apparel and clothing accessories of leather",26),
       ("4205","Other articles of leather or of composition leather",10)],
 # 52 cotton
 "52":[("5205","Cotton yarn (>=85% cotton), not for retail sale",30),
       ("5208","Woven fabrics of cotton (>=85%), weighing <=200 g/m2",18),
       ("5209","Woven fabrics of cotton (>=85%), weighing >200 g/m2",16),
       ("5201","Cotton, not carded or combed",22),
       ("5207","Cotton yarn put up for retail sale",6),
       ("5206","Cotton yarn (<85% cotton), not for retail sale",8)],
 # 54 man-made filaments
 "54":[("5402","Synthetic filament yarn, not for retail sale",34),
       ("5407","Woven fabrics of synthetic filament yarn",40),
       ("5403","Artificial filament yarn, not for retail sale",12),
       ("5408","Woven fabrics of artificial filament yarn",14)],
 # 55 man-made staple
 "55":[("5509","Yarn of synthetic staple fibres, not for retail sale",28),
       ("5512","Woven fabrics of synthetic staple fibres (>=85%)",22),
       ("5503","Synthetic staple fibres, not carded or combed",26),
       ("5516","Woven fabrics of artificial staple fibres",12),
       ("5513","Woven fabrics of synthetic staple fibres mixed with cotton",12)],
 # 57 carpets
 "57":[("5701","Carpets and floor coverings, knotted",30),
       ("5702","Carpets, woven, not tufted or flocked",26),
       ("5703","Carpets and floor coverings, tufted",34),
       ("5705","Other carpets and textile floor coverings",10)],
 # 61 knitted apparel
 "61":[("6109","T-shirts, singlets and other vests, knitted or crocheted",22),
       ("6110","Jerseys, pullovers, cardigans, waistcoats, knitted or crocheted",20),
       ("6105","Men's or boys' shirts, knitted or crocheted",12),
       ("6106","Women's or girls' blouses and shirts, knitted or crocheted",10),
       ("6104","Women's or girls' suits, dresses, skirts, trousers, knitted",14),
       ("6103","Men's or boys' suits, jackets, trousers, knitted or crocheted",10),
       ("6111","Babies' garments and clothing accessories, knitted or crocheted",12)],
 # 62 woven apparel
 "62":[("6204","Women's or girls' suits, dresses, skirts, trousers (not knitted)",24),
       ("6203","Men's or boys' suits, jackets, trousers (not knitted)",18),
       ("6205","Men's or boys' shirts (not knitted)",14),
       ("6206","Women's or girls' blouses and shirts (not knitted)",12),
       ("6202","Women's or girls' overcoats, anoraks and similar (not knitted)",10),
       ("6201","Men's or boys' overcoats, anoraks and similar (not knitted)",10),
       ("6212","Brassieres, girdles, corsets, braces and similar articles",12)],
 # 63 made-ups
 "63":[("6302","Bed linen, table linen, toilet linen and kitchen linen",48),
       ("6304","Other furnishing articles (excluding those of heading 9404)",18),
       ("6303","Curtains, blinds and interior blinds; bed valances",10),
       ("6307","Other made-up articles, including dress patterns",14),
       ("6301","Blankets and travelling rugs",6),
       ("6305","Sacks and bags of a kind used for packing goods",4)],
 # 64 footwear
 "64":[("6403","Footwear with uppers of leather",36),
       ("6404","Footwear with uppers of textile materials",26),
       ("6402","Footwear with outer soles and uppers of rubber or plastics",24),
       ("6406","Parts of footwear; removable insoles, heel cushions",14)],
 # 69 ceramics
 "69":[("6907","Ceramic flags and paving, hearth or wall tiles",56),
       ("6910","Ceramic sinks, wash basins, water closet pans and sanitary fixtures",22),
       ("6911","Tableware, kitchenware of porcelain or china",8),
       ("6909","Ceramic wares for laboratory, chemical or technical uses",8),
       ("6914","Other ceramic articles",6)],
 # 71 gems & jewellery
 "71":[("7102","Diamonds, whether or not worked, but not mounted or set",34),
       ("7113","Articles of jewellery and parts thereof, of precious metal",30),
       ("7108","Gold (including gold plated with platinum), unwrought or semi-manufactured",14),
       ("7104","Synthetic or reconstructed precious/semi-precious stones (incl. lab-grown)",10),
       ("7103","Precious and semi-precious stones (other than diamonds)",6),
       ("7114","Articles of goldsmiths' or silversmiths' wares",6)],
 # 72 iron & steel
 "72":[("7208","Flat-rolled products of iron/non-alloy steel, hot-rolled, >=600mm",20),
       ("7210","Flat-rolled products of iron/non-alloy steel, clad, plated or coated",14),
       ("7209","Flat-rolled products of iron/non-alloy steel, cold-rolled, >=600mm",12),
       ("7207","Semi-finished products of iron or non-alloy steel",14),
       ("7213","Bars and rods, hot-rolled, in irregularly wound coils",10),
       ("7219","Flat-rolled products of stainless steel, width >=600mm",14),
       ("7202","Ferro-alloys",16)],
 # 73 articles of iron/steel
 "73":[("7308","Structures and parts of structures, of iron or steel",22),
       ("7304","Tubes, pipes and hollow profiles, seamless, of iron or steel",18),
       ("7306","Other tubes, pipes and hollow profiles of iron or steel",14),
       ("7318","Screws, bolts, nuts, washers and similar articles of iron/steel",14),
       ("7326","Other articles of iron or steel",18),
       ("7307","Tube or pipe fittings of iron or steel",14)],
 # 76 aluminium
 "76":[("7601","Unwrought aluminium",34),
       ("7604","Aluminium bars, rods and profiles",14),
       ("7606","Aluminium plates, sheets and strip, thickness >0.2mm",16),
       ("7607","Aluminium foil, thickness <=0.2mm",12),
       ("7616","Other articles of aluminium",14),
       ("7602","Aluminium waste and scrap",10)],
 # 84 machinery
 "84":[("8411","Turbojets, turbopropellers and other gas turbines",6),
       ("8413","Pumps for liquids; liquid elevators",8),
       ("8414","Air or vacuum pumps, compressors and fans",8),
       ("8421","Centrifuges; filtering or purifying machinery",8),
       ("8431","Parts for lifting, handling, excavating machinery",6),
       ("8443","Printing machinery; parts and accessories",6),
       ("8481","Taps, cocks, valves and similar appliances",10),
       ("8483","Transmission shafts, gears, bearings, clutches",8),
       ("8409","Parts for spark-ignition or compression-ignition engines",10),
       ("8407","Spark-ignition reciprocating or rotary internal combustion engines",6),
       ("8471","Automatic data-processing machines and units thereof",8),
       ("8544","(see 85)  — placeholder",0)][:11],
 # 85 electrical
 "85":[("8517","Telephone sets, smartphones and other apparatus for communication",34),
       ("8544","Insulated wire, cable and other insulated electric conductors",12),
       ("8542","Electronic integrated circuits",8),
       ("8541","Semiconductor devices; photovoltaic cells; LEDs",8),
       ("8536","Electrical apparatus for switching/protecting circuits (<=1000V)",8),
       ("8504","Electrical transformers, static converters and inductors",10),
       ("8507","Electric accumulators (batteries), including separators",6),
       ("8501","Electric motors and generators",6),
       ("8518","Microphones, loudspeakers, headphones, amplifiers",4),
       ("8528","Monitors and projectors; reception apparatus for television",4)],
 # 87 vehicles
 "87":[("8703","Motor cars and other motor vehicles for transport of persons",30),
       ("8708","Parts and accessories of motor vehicles",34),
       ("8711","Motorcycles (incl. mopeds) and cycles with auxiliary motor",14),
       ("8704","Motor vehicles for the transport of goods",8),
       ("8714","Parts and accessories of motorcycles and bicycles",8),
       ("8716","Trailers and semi-trailers; other vehicles, not mechanically propelled",6)],
 # 88 aircraft
 "88":[("8803","Parts of aircraft and spacecraft (of headings 8801/8802)",44),
       ("8802","Powered aircraft (helicopters, aeroplanes); spacecraft",40),
       ("8806","Unmanned aircraft (drones)",16)],
 # 90 instruments
 "90":[("9018","Instruments and appliances used in medical, surgical or dental sciences",34),
       ("9021","Orthopaedic appliances; artificial parts; hearing aids",12),
       ("9027","Instruments for physical or chemical analysis",10),
       ("9013","Liquid crystal devices; lasers; other optical appliances",8),
       ("9026","Instruments for measuring flow, level, pressure of liquids/gases",8),
       ("9031","Measuring or checking instruments, appliances and machines n.e.s.",10),
       ("9001","Optical fibres and cables; polarising material; lenses (unmounted)",10),
       ("9004","Spectacles, goggles and the like, corrective or protective",8)],
 # 93 arms
 "93":[("9306","Bombs, grenades, ammunition and parts thereof",50),
       ("9301","Military weapons (other than revolvers, pistols, sidearms)",22),
       ("9302","Revolvers and pistols",8),
       ("9305","Parts and accessories of arms",12),
       ("9303","Other firearms and similar devices (sporting, signalling)",8)],
 # 94 furniture
 "94":[("9401","Seats (other than dentists'/barbers'), and parts thereof",30),
       ("9403","Other furniture and parts thereof",30),
       ("9405","Luminaires and lighting fittings; illuminated signs",18),
       ("9404","Mattress supports; bedding and similar furnishings",14),
       ("9406","Prefabricated buildings",8)],
}

# ---- how-to-start econ archetypes (per HS-4 family; estimate) -----------------
# unit economics for a new-entrant private-label converter; feeds the same
# runModel engine as the Product tab. Directional bands, never a quote.
ECON = {
 "petro_ref":    dict(unit="tonne", priceUsd=780,  grossPct=12, capexCr=90,  capacityPerYr=60000,  fixedCr=20, certs=["ISO 9001","API","ISO 14001"], entry="Blender / re-refiner (capital-heavy)"),
 "commodity_raw":dict(unit="tonne", priceUsd=850,  grossPct=12, capexCr=30,  capacityPerYr=25000,  fixedCr=10, certs=["ISO 9001"], entry="Merchant exporter"),
 "fine_chem":    dict(unit="tonne", priceUsd=9000, grossPct=26, capexCr=60,  capacityPerYr=5000,   fixedCr=16, certs=["REACH","ISO 9001","cGMP intermediate"], entry="Private-label converter"),
 "pharma_ff":    dict(unit="kg",    priceUsd=60000,grossPct=30, capexCr=120, capacityPerYr=2000,   fixedCr=24, certs=["USFDA","WHO-GMP","EU-GMP"], entry="API / CDMO converter"),
 "marine_va":    dict(unit="tonne", priceUsd=9000, grossPct=16, capexCr=40,  capacityPerYr=4000,   fixedCr=15, certs=["HACCP","BAP/BRC","EU-approved","MPEDA"], entry="IQF value-add converter"),
 "agri_processed":dict(unit="tonne",priceUsd=2000, grossPct=20, capexCr=25,  capacityPerYr=6000,   fixedCr=10, certs=["FSSAI","HACCP","ISO 22000"], entry="Processor → private label"),
 "textile_made": dict(unit="tonne", priceUsd=7000, grossPct=18, capexCr=35,  capacityPerYr=6000,   fixedCr=13, certs=["OEKO-TEX","GOTS","ISO 9001"], entry="Converter / made-up manufacturer"),
 "apparel":      dict(unit="piece", priceUsd=6,    grossPct=22, capexCr=30,  capacityPerYr=3000000,fixedCr=14, certs=["OEKO-TEX","WRAP","Sedex"], entry="CMT → FOB manufacturer"),
 "leather_goods":dict(unit="piece", priceUsd=25,   grossPct=24, capexCr=30,  capacityPerYr=800000, fixedCr=12, certs=["LWG","REACH","ISO 9001"], entry="Converter / finished-goods maker"),
 "auto_parts":   dict(unit="piece", priceUsd=40,   grossPct=20, capexCr=60,  capacityPerYr=1000000,fixedCr=16, certs=["IATF 16949","PPAP","ISO 9001"], entry="Tier-2 → Tier-1 supplier"),
 "machinery":    dict(unit="unit",  priceUsd=900,  grossPct=22, capexCr=60,  capacityPerYr=20000,  fixedCr=16, certs=["CE","UL","ISO 9001"], entry="OEM component maker"),
 "electronics":  dict(unit="piece", priceUsd=18,   grossPct=18, capexCr=45,  capacityPerYr=2000000,fixedCr=14, certs=["BIS","IPC-A-610","RoHS","ISO 9001"], entry="EMS / PCBA"),
 "steel_prod":   dict(unit="tonne", priceUsd=2000, grossPct=14, capexCr=60,  capacityPerYr=20000,  fixedCr=16, certs=["ISO 9001","PED","API"], entry="Re-roller / fabricator"),
 "aluminium":    dict(unit="tonne", priceUsd=3200, grossPct=16, capexCr=55,  capacityPerYr=15000,  fixedCr=14, certs=["ISO 9001","ASI"], entry="Extruder / roller"),
 "ceramic":      dict(unit="ksqm",  priceUsd=9000, grossPct=20, capexCr=40,  capacityPerYr=3000,   fixedCr=12, certs=["CE","ANSI","ISO 9001"], entry="Morbi-cluster converter"),
 "gems_jewel":   dict(unit="piece", priceUsd=300,  grossPct=26, capexCr=25,  capacityPerYr=150000, fixedCr=12, certs=["IGI/GIA","BIS Hallmark","RJC"], entry="Manufacturer → private label"),
 "plastics":     dict(unit="tonne", priceUsd=2000, grossPct=18, capexCr=40,  capacityPerYr=6000,   fixedCr=12, certs=["ISO 9001","FDA food-grade","REACH"], entry="Converter / moulder"),
 "defence":      dict(unit="unit",  priceUsd=90000,grossPct=32, capexCr=60,  capacityPerYr=800,    fixedCr=20, certs=["AS9100","DGQA/MoD","ISO 9001"], entry="Sub-system OEM"),
 "generic_mfg":  dict(unit="unit",  priceUsd=120,  grossPct=18, capexCr=35,  capacityPerYr=500000, fixedCr=12, certs=["ISO 9001","CE"], entry="Contract manufacturer"),
}

# ---- policy archetypes (tariffs / FTAs / RoDTEP / AD flags; estimate) ---------
POLICY = {
 "petro":   dict(rodtepPct=0.5, ftas=[], adFlags=[], tariffs=[("USA","0–2.5%"),("EU","0–4.7%"),("United Arab Emirates","0–5%")]),
 "chem":    dict(rodtepPct=1.5, ftas=["UAE CEPA","Australia ECTA","UK CETA (2025)"], adFlags=["EU/US AD duties on select dyes & chemicals"], tariffs=[("USA","3.7%"),("EU","5.5%"),("United Arab Emirates","0% (CEPA)"),("China","6.5%")]),
 "pharma":  dict(rodtepPct=1.0, ftas=["UAE CEPA","Australia ECTA","UK CETA (2025)"], adFlags=[], tariffs=[("USA","0%"),("EU","0%"),("United Arab Emirates","0% (CEPA)"),("Brazil","8–14%")]),
 "marine":  dict(rodtepPct=2.5, ftas=["UAE CEPA","Japan CEPA","UK CETA (2025)"], adFlags=["US AD/CVD order on frozen warm-water shrimp"], tariffs=[("USA","0–5% + AD/CVD"),("EU","12–20%"),("Japan","1–5% (CEPA)"),("China","2–7%")]),
 "textile": dict(rodtepPct=4.3, ftas=["UAE CEPA","Australia ECTA","UK CETA (2025)"], adFlags=[], tariffs=[("USA","9–16%"),("EU","9.6%"),("United Kingdom","0% (FTA)"),("United Arab Emirates","0% (CEPA)")]),
 "metal":   dict(rodtepPct=1.5, ftas=["UAE CEPA","Australia ECTA"], adFlags=["US Section 232 tariffs on steel/aluminium","EU safeguard quotas"], tariffs=[("USA","25% (§232)"),("EU","safeguard quota"),("United Arab Emirates","0–5%")]),
 "auto":    dict(rodtepPct=1.8, ftas=["UAE CEPA","Australia ECTA","UK CETA (2025)"], adFlags=[], tariffs=[("USA","2.5%"),("EU","3–4.5%"),("United Arab Emirates","0–5%")]),
 "machine": dict(rodtepPct=2.0, ftas=["UAE CEPA","ASEAN FTA"], adFlags=[], tariffs=[("USA","0–2.6%"),("EU","1.7–2.7%"),("United Arab Emirates","0–5%")]),
 "ceramic": dict(rodtepPct=5.5, ftas=["UAE CEPA"], adFlags=["US & EU AD orders on ceramic tile (China-led; India watch-listed)"], tariffs=[("USA","8.5% + AD watch"),("EU","AD-exposed"),("Saudi Arabia","5%")]),
 "leather": dict(rodtepPct=2.5, ftas=["UAE CEPA","UK CETA (2025)"], adFlags=[], tariffs=[("USA","8–15%"),("EU","3.5–8%"),("United Kingdom","0% (FTA)")]),
 "agri":    dict(rodtepPct=2.0, ftas=["UAE CEPA","ASEAN FTA"], adFlags=[], tariffs=[("USA","2–6%"),("EU","variable + TRQ"),("Saudi Arabia","5%")]),
 "gems":    dict(rodtepPct=0.5, ftas=["UAE CEPA"], adFlags=[], tariffs=[("USA","0%"),("United Arab Emirates","0% (CEPA)"),("EU","0–2.5%")]),
 "defence": dict(rodtepPct=0.5, ftas=[], adFlags=["MTCR / end-use & export-control clearance required"], tariffs=[("Buyer nation","government-to-government")]),
 "generic": dict(rodtepPct=1.5, ftas=["UAE CEPA","Australia ECTA"], adFlags=[], tariffs=[("USA","2–4%"),("EU","3–4%"),("United Arab Emirates","0% (CEPA)")]),
}

# supply-archetype -> (econ key, policy key); a few chapter-specific overrides
ARCH = {
 "petro": ("petro_ref", "petro"), "metalore": ("commodity_raw", "petro"),
 "chem": ("fine_chem", "chem"), "pharma": ("pharma_ff", "pharma"),
 "gems": ("gems_jewel", "gems"), "textile": ("textile_made", "textile"),
 "apparel": ("apparel", "textile"), "marine": ("marine_va", "marine"),
 "agri": ("agri_processed", "agri"), "spice": ("agri_processed", "agri"),
 "machine": ("machinery", "machine"), "elec": ("electronics", "machine"),
 "auto": ("auto_parts", "auto"), "steel": ("steel_prod", "metal"),
 "ceramic": ("ceramic", "ceramic"), "leather": ("leather_goods", "leather"),
 "plastic": ("plastics", "generic"), "generic": ("generic_mfg", "generic"),
}
CH_OVERRIDE = {"93": ("defence", "defence"), "76": ("aluminium", "metal")}

def policy_json(pkey):
    p = POLICY[pkey]
    return {"rodtepPct": p["rodtepPct"], "ftas": list(p["ftas"]), "adFlags": list(p["adFlags"]),
            "tariffs": [{"market": m, "mfn": t} for m, t in p["tariffs"]]}

def econ_json(ekey):
    return dict(ECON[ekey])


# ---- helpers -----------------------------------------------------------------
def dedup_supply(rows):
    """merge duplicate state keys, keep order, renormalise to <=100."""
    agg = {}
    order = []
    for st, sh in rows:
        if st not in agg:
            agg[st] = 0; order.append(st)
        agg[st] += sh
    return [(st, agg[st]) for st in order]

def tier_score(share_pct, cagr, india_exp):
    """white-space heuristic: low current share + high demand growth + real scale = prime (A)."""
    growth = max(0.0, min(1.0, (cagr - 3) / 7.0))           # 3%..10% CAGR band (demand pull)
    headroom = 1.0 - min(share_pct, 40.0) / 40.0            # >40% share = saturated
    scale = min(india_exp, 25000) / 25000.0                 # export scale anchor
    score = round(30 + 66 * (0.58 * growth + 0.24 * headroom + 0.18 * scale))
    score = max(30, min(96, score))
    tier = "A" if score >= 71 else ("B" if score >= 56 else "C")
    return tier, score

def india_share(chap, india_exp, global_b):
    """India's share of world imports for the chapter (%), estimate."""
    if global_b <= 0: return 0.0
    return round(min(60.0, india_exp / (global_b * 1000.0) * 100.0), 1)

# ---- build nodes -------------------------------------------------------------
nodes = []
for ch in range(1, 98):
    if ch == 77:  # reserved, does not exist
        continue
    code = f"{ch:02d}"
    if code not in CHAPTERS:
        continue
    sup_arch, dest_arch, global_b, cagr = PROFILE[code]
    ekey, pkey = CH_OVERRIDE.get(code, ARCH[sup_arch])
    econ = econ_json(ekey)
    policy = policy_json(pkey)
    rn, sec_title = section_of(ch)
    india_exp = CHAP_EXPORT.get(code, 300)
    supply = dedup_supply(SUPPLY[sup_arch])
    dest_w = DEST[dest_arch]
    dest_total_w = sum(w for _, w in dest_w)
    destinations = [{"country": c, "usdM": round(india_exp * w / dest_total_w)} for c, w in dest_w]
    shr = india_share(code, india_exp, global_b)
    tier, score = tier_score(shr, cagr, india_exp)
    nodes.append({
        "code": code, "level": 2, "hs2": code, "hs4": None,
        "section": rn, "sectionTitle": sec_title,
        "desc": CHAPTERS[code],
        "indiaExportUsdM": india_exp,
        "supplyStates": [{"state": s, "sharePct": p} for s, p in supply],
        "destinations": destinations,
        "globalImportUsdB": global_b, "indiaSharePct": shr, "cagrPct": cagr,
        "tier": tier, "score": score,
        "econ": econ, "policy": policy,
        "provenance": {"taxonomy": "official", "figures": "estimate", "splits": "derived", "policy": "estimate"},
    })

    # HS-4 children (curated real headings for material chapters)
    children = HS4.get(code)
    if not children:
        continue
    wtot = sum(w for _, _, w in children) or 1
    for h4, desc, w in children:
        if w <= 0:
            continue
        exp = round(india_exp * w / wtot)
        d4 = [{"country": c, "usdM": round(exp * ww / dest_total_w)} for c, ww in dest_w]
        s4 = india_share(code, exp, global_b)
        t4, sc4 = tier_score(s4, cagr, exp)
        nodes.append({
            "code": h4, "level": 4, "hs2": code, "hs4": h4,
            "section": rn, "sectionTitle": sec_title,
            "desc": desc,
            "indiaExportUsdM": exp,
            # HS-4 inherits the chapter's state split (unpublished at HS-4) -> derived
            "supplyStates": [{"state": s, "sharePct": p} for s, p in supply],
            "destinations": d4,
            "globalImportUsdB": round(global_b * w / wtot, 1),
            "indiaSharePct": s4, "cagrPct": cagr,
            "tier": t4, "score": sc4,
            "econ": econ, "policy": policy,
            "provenance": {"taxonomy": "official", "figures": "estimate", "splits": "derived", "policy": "estimate"},
        })

# ---- meta + emit -------------------------------------------------------------
n2 = sum(1 for n in nodes if n["level"] == 2)
n4 = sum(1 for n in nodes if n["level"] == 4)
out = {
    "meta": {
        "generated": datetime.date.today().isoformat(),
        "scope": "HS 2022 taxonomy (HS-2 + curated HS-4), India-centric FY25",
        "rows": len(nodes), "hs2": n2, "hs4": n4,
        "provenanceRules": (
            "HS nomenclature = official (WCO HS 2022). India export values, global "
            "import scale, CAGR and India share = screening-grade ESTIMATES. State "
            "supply splits are DERIVED from a cluster model (HS-4 inherits its "
            "chapter's split — India does not publish HS-4 origin-state data). "
            "No estimate is presented as an official statistic."
        ),
        "sources": [
            "WCO Harmonized System 2022 nomenclature (taxonomy)",
            "DGCIS / Dept. of Commerce export aggregates FY25 (India value, order-of-magnitude)",
            "Industrial-cluster geography & PLI footprint (state splits, derived)",
        ],
    },
    "sections": [{"n": rn, "title": t, "chapters": [f"{c:02d}" for c in r]} for rn, t, r in SECTIONS],
    "nodes": nodes,
}

here = os.path.dirname(os.path.abspath(__file__))
path = os.path.join(here, "hs.json")
with open(path, "w") as f:
    json.dump(out, f, separators=(",", ":"), ensure_ascii=False)
print(f"wrote {path}: {len(nodes)} rows ({n2} HS-2 + {n4} HS-4), {os.path.getsize(path)} bytes")
