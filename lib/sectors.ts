// Sector → representative export products + typical destinations.
// Used to translate a state's company mix into an export read.
export const SECTOR_META: Record<string, { products: string[]; dest: string[] }> = {
  "Oil & Gas": { products: ["Refined petroleum", "Petrochemicals"], dest: ["Netherlands", "UAE", "Singapore"] },
  "Mining & Metals": { products: ["Steel", "Aluminium", "Iron ore", "Ferro-alloys"], dest: ["China", "UAE", "Italy", "Vietnam"] },
  Pharmaceuticals: { products: ["Generic formulations", "APIs", "Vaccines"], dest: ["USA", "UK", "Africa", "EU"] },
  "Auto Ancillaries": { products: ["Forgings", "Wiring", "Batteries", "Castings"], dest: ["USA", "Germany", "Japan"] },
  "Capital Goods": { products: ["Machinery", "Transformers", "Steel tubes", "Cables"], dest: ["USA", "Middle East", "Africa"] },
  "Consumer Staples": { products: ["Edible oils", "Packaged foods", "Tobacco", "Paints"], dest: ["UAE", "USA", "Africa"] },
  Chemicals: { products: ["Dyes & pigments", "Intermediates", "Adhesives"], dest: ["USA", "China", "Germany"] },
  "Agro Chemicals": { products: ["Agrochemical technicals", "Formulations"], dest: ["Brazil", "USA", "EU"] },
  "Textile & Garments": { products: ["Cotton yarn", "Home textiles", "Apparel"], dest: ["USA", "EU", "UK"] },
  "Technology-Software": { products: ["IT & software services"], dest: ["USA", "UK", "EU"] },
  "Consumer Durables": { products: ["Electronics (EMS)", "Cables", "Appliances"], dest: ["USA", "UAE", "Africa"] },
  Automobile: { products: ["2/3-wheelers", "Cars", "Tractors"], dest: ["Africa", "LatAm", "SE Asia"] },
  Jewellery: { products: ["Cut diamonds", "Gold jewellery", "LGD"], dest: ["USA", "UAE", "Hong Kong"] },
  "Food Processing": { products: ["Basmati rice", "Frozen shrimp", "Dairy"], dest: ["Middle East", "USA", "EU"] },
  "Aerospace & Defence": { products: ["Munitions", "Avionics", "Shipbuilding"], dest: ["USA", "France", "SE Asia"] },
  Fertilizers: { products: ["Urea", "Complex fertilizers"], dest: ["Domestic-led"] },
  Cement: { products: ["Cement", "Clinker"], dest: ["Nepal", "Bangladesh", "Africa"] },
  "Cement & Bldg Materials": { products: ["Cement", "Clinker", "Boards"], dest: ["Nepal", "Africa"] },
  Petrochemicals: { products: ["Polymers", "Plastics"], dest: ["China", "Turkey", "EU"] },
  "Petrochemicals & Plastics": { products: ["Polymers", "Plastic articles"], dest: ["China", "EU", "Africa"] },
  Power: { products: ["Power equipment", "Electricity"], dest: ["Domestic-led"] },
  Sugar: { products: ["Sugar", "Ethanol"], dest: ["Indonesia", "Bangladesh", "Africa"] },
  "Ceramic Products": { products: ["Tiles", "Sanitaryware"], dest: ["USA", "Gulf", "Africa"] },
  "Footwear & Accessories": { products: ["Leather footwear", "Accessories"], dest: ["USA", "EU", "UK"] },
  Tyres: { products: ["Tyres & tubes"], dest: ["USA", "EU", "Africa"] },
  Paper: { products: ["Paper & paperboard"], dest: ["Middle East", "SE Asia"] },
  Packaging: { products: ["Flexible & rigid packaging"], dest: ["Africa", "Middle East"] },
};
export function metaFor(sector: string) {
  return SECTOR_META[sector] ?? { products: ["Industrial goods"], dest: ["Global"] };
}
