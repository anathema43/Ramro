// Seed data for Firebase artisans collection
import { collection, addDoc, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const seedArtisans = [
  {
    name: "Deepak Sharma",
    title: "Master Pickle Maker",
    location: "Darjeeling, West Bengal",
    region: "West Bengal",
    experience: 25,
    profileImage: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=800",
    shortBio: "Third-generation pickle maker specializing in traditional Darjeeling recipes passed down through his family.",
    story: `Deepak Sharma learned the art of pickle making from his grandmother, who taught him the secret blend of spices that makes Darjeeling pickles unique. Growing up in the misty hills of Darjeeling, he witnessed how each season brought different vegetables and fruits that could be preserved using ancient techniques.

His family has been making pickles for over 75 years, and Deepak has perfected the recipes while maintaining the traditional methods. He sources all his ingredients from local farmers in the Darjeeling hills, ensuring that every jar tells the story of the mountains.

Today, Deepak employs 8 local women in his small workshop, providing them with steady income while preserving the traditional knowledge of pickle making. His pickles are made in small batches, ensuring quality and authenticity in every jar.`,
    specialties: ["Traditional Pickles", "Fermentation", "Spice Blending"],
    techniques: [
      "Traditional fermentation methods",
      "Hand-grinding of spices",
      "Solar drying techniques",
      "Clay pot aging"
    ],
    values: [
      "Preserving family recipes",
      "Supporting local farmers",
      "Sustainable practices",
      "Quality over quantity"
    ],
    culturalHeritage: "Darjeeling pickle making tradition",
    familyMembers: 6,
    rating: 4.8,
    reviewCount: 24,
    featured: true,
    productCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: "Laxmi Devi",
    title: "Wild Honey Collector",
    location: "Manali, Himachal Pradesh",
    region: "Himachal Pradesh",
    experience: 18,
    profileImage: "https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=800",
    shortBio: "Expert honey collector who harvests wild honey from high-altitude forests using traditional sustainable methods.",
    story: `Laxmi Devi comes from a family of traditional honey collectors in the high mountains of Himachal Pradesh. She learned the ancient art of wild honey collection from her father, who taught her to read the mountains and understand the behavior of wild bees.

At altitudes of over 3000 meters, Laxmi carefully harvests honey from wild bee colonies, using smoke and traditional tools that have been used for centuries. She follows strict sustainable practices, never taking more than the bees can spare, ensuring the colonies remain healthy.

Her honey is completely raw and unprocessed, containing all the natural enzymes and nutrients that make Himalayan honey so special. Each batch reflects the unique flora of the high-altitude forests where the bees collect nectar.

Laxmi has trained 5 other women in her village in sustainable honey collection, creating a small cooperative that provides income while protecting the mountain ecosystem.`,
    specialties: ["Wild Honey Collection", "Sustainable Harvesting", "High-Altitude Foraging"],
    techniques: [
      "Traditional smoking methods",
      "Sustainable harvesting practices",
      "Natural comb extraction",
      "Raw honey preservation"
    ],
    values: [
      "Environmental conservation",
      "Sustainable harvesting",
      "Community cooperation",
      "Natural purity"
    ],
    culturalHeritage: "Himalayan honey collection traditions",
    familyMembers: 4,
    rating: 4.9,
    reviewCount: 18,
    featured: true,
    productCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: "Ashok Singh",
    title: "Organic Rice Farmer",
    location: "Uttarakhand Hills",
    region: "Uttarakhand",
    experience: 22,
    profileImage: "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800",
    shortBio: "Dedicated organic farmer growing ancient varieties of red rice in terraced fields using traditional methods.",
    story: `Ashok Singh is a passionate advocate for organic farming and the preservation of ancient rice varieties. His family has been farming in the terraced fields of Uttarakhand for generations, and he has dedicated his life to maintaining these traditional practices.

He grows several heritage varieties of red rice that are native to the Himalayan region. These varieties are naturally resistant to pests and diseases, requiring no chemical inputs. The terraced fields, carved into the mountainside by his ancestors, use an ingenious water management system that has sustained agriculture for centuries.

Ashok's rice is grown at altitudes between 1500-2000 meters, where the cool mountain air and pure water from glacial streams create ideal growing conditions. The rice is harvested by hand and processed using traditional methods that preserve its nutritional value.

Through his work, Ashok supports 12 farming families in his village, teaching them organic methods and helping them transition away from chemical farming. His cooperative has become a model for sustainable agriculture in the region.`,
    specialties: ["Organic Farming", "Heritage Rice Varieties", "Terraced Agriculture"],
    techniques: [
      "Terraced field cultivation",
      "Natural pest management",
      "Traditional seed preservation",
      "Hand harvesting methods"
    ],
    values: [
      "Organic farming principles",
      "Biodiversity conservation",
      "Soil health preservation",
      "Community education"
    ],
    culturalHeritage: "Himalayan terraced farming traditions",
    familyMembers: 5,
    rating: 4.7,
    reviewCount: 31,
    featured: true,
    productCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: "Tenzin Norbu",
    title: "Buckwheat Cultivator",
    location: "Spiti Valley, Himachal Pradesh",
    region: "Himachal Pradesh",
    experience: 15,
    profileImage: "https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=800",
    shortBio: "High-altitude farmer specializing in buckwheat cultivation in the harsh but pristine environment of Spiti Valley.",
    story: `Tenzin Norbu farms in one of the most challenging environments on Earth - the high-altitude desert of Spiti Valley at over 4000 meters above sea level. Here, where the growing season is just 4 months long, he cultivates buckwheat using methods passed down through Tibetan Buddhist traditions.

The extreme conditions of Spiti - intense sunlight, freezing nights, and minimal rainfall - create buckwheat with exceptional nutritional density. Tenzin's buckwheat is completely organic by necessity, as the harsh environment naturally protects against pests.

Following Buddhist principles of harmony with nature, Tenzin practices sustainable farming that works with the natural cycles of the high mountains. His buckwheat is hand-planted, hand-weeded, and hand-harvested, ensuring minimal impact on the fragile mountain ecosystem.

Tenzin is also a cultural bridge, helping to preserve Tibetan farming traditions while adapting to modern market needs. His work supports 8 families in his remote village, providing them with income from their traditional crops.`,
    specialties: ["High-Altitude Farming", "Buckwheat Cultivation", "Tibetan Agriculture"],
    techniques: [
      "High-altitude cultivation",
      "Traditional Tibetan methods",
      "Natural crop rotation",
      "Hand processing techniques"
    ],
    values: [
      "Buddhist farming principles",
      "Environmental harmony",
      "Cultural preservation",
      "Community resilience"
    ],
    culturalHeritage: "Tibetan Buddhist farming traditions",
    familyMembers: 3,
    rating: 4.6,
    reviewCount: 12,
    featured: false,
    productCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: "Fatima Khan",
    title: "Spice Master",
    location: "Kashmir Valley",
    region: "Kashmir",
    experience: 30,
    profileImage: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=800",
    shortBio: "Master spice blender creating traditional Kashmiri spice mixes using recipes perfected over three decades.",
    story: `Fatima Khan is renowned throughout Kashmir for her exceptional spice blends that capture the essence of Kashmiri cuisine. She learned the art of spice blending from her mother-in-law, who was famous in their village for her mastery of traditional recipes.

Working from her home in the Kashmir Valley, Fatima hand-selects each spice, often traveling to different regions to source the finest cardamom, saffron, and other precious spices. She roasts and grinds everything by hand in small batches, ensuring that each blend maintains its aromatic potency.

Her spice mixes are used in traditional Kashmiri dishes and have been refined through years of experimentation and feedback from local families. Each blend tells the story of Kashmir's rich culinary heritage and the complex flavors that define the region's cuisine.

Fatima has trained 6 women in her neighborhood in the art of spice blending, creating a small enterprise that provides income while preserving traditional knowledge. Her workshop has become a gathering place where recipes and stories are shared.`,
    specialties: ["Spice Blending", "Kashmiri Cuisine", "Traditional Recipes"],
    techniques: [
      "Hand-roasting of spices",
      "Traditional grinding methods",
      "Flavor balancing techniques",
      "Aromatic preservation"
    ],
    values: [
      "Culinary tradition preservation",
      "Quality ingredients sourcing",
      "Women's empowerment",
      "Cultural recipe sharing"
    ],
    culturalHeritage: "Kashmiri culinary traditions",
    familyMembers: 7,
    rating: 4.8,
    reviewCount: 27,
    featured: false,
    productCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    name: "Ram Prasad",
    title: "Forest Honey Guardian",
    location: "Garhwal Himalayas",
    region: "Uttarakhand",
    experience: 20,
    profileImage: "https://images.pexels.com/photos/1181562/pexels-photo-1181562.jpeg?auto=compress&cs=tinysrgb&w=800",
    shortBio: "Forest guardian and honey collector protecting wild bee colonies while sustainably harvesting forest honey.",
    story: `Ram Prasad serves as both a forest guardian and honey collector in the dense forests of the Garhwal Himalayas. His role goes beyond honey collection - he is a protector of the forest ecosystem and the wild bee colonies that call it home.

Having spent two decades in the forests, Ram has developed an intimate knowledge of bee behavior and forest ecology. He can identify different types of wild bees and knows exactly when and how much honey can be sustainably harvested without harming the colonies.

His honey comes from bees that forage on a diverse range of wild flowers, herbs, and trees found only in the pristine Himalayan forests. This creates honey with complex flavors and exceptional medicinal properties that cannot be replicated in managed apiaries.

Ram works with the local forest department to protect bee habitats and has trained 4 other forest workers in sustainable honey collection. His efforts have helped establish protected zones for wild bee colonies while providing sustainable income for forest communities.`,
    specialties: ["Forest Conservation", "Wild Honey", "Ecosystem Protection"],
    techniques: [
      "Wild colony identification",
      "Sustainable extraction methods",
      "Forest ecosystem management",
      "Natural honey preservation"
    ],
    values: [
      "Forest conservation",
      "Wildlife protection",
      "Sustainable harvesting",
      "Ecosystem balance"
    ],
    culturalHeritage: "Himalayan forest traditions",
    familyMembers: 4,
    rating: 4.9,
    reviewCount: 15,
    featured: false,
    productCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const seedArtisansToFirestore = async () => {
  try {
    console.log("Starting artisan seeding...");
    
    // Clear existing artisans (optional - remove in production)
    const existingArtisans = await getDocs(collection(db, "artisans"));
    const deletePromises = existingArtisans.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    console.log("Cleared existing artisans");

    // Add seed artisans
    const addPromises = seedArtisans.map(artisan => 
      addDoc(collection(db, "artisans"), artisan)
    );
    
    const results = await Promise.all(addPromises);
    console.log(`Successfully seeded ${results.length} artisans to Firestore`);
    
    return results;
  } catch (error) {
    console.error("Error seeding artisans:", error);
    throw error;
  }
};

export default seedArtisans;