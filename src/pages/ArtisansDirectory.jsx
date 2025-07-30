import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useArtisanStore } from "../store/artisanStore";
import ResponsiveImage from "../components/ResponsiveImage";
import LoadingSpinner from "../components/LoadingSpinner";
import { MapPinIcon, StarIcon, CalendarIcon } from "@heroicons/react/24/outline";

export default function ArtisansDirectory() {
  const { artisans, featuredArtisans, fetchArtisans, fetchFeaturedArtisans, loading } = useArtisanStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("all");

  useEffect(() => {
    fetchArtisans();
    fetchFeaturedArtisans();
  }, [fetchArtisans, fetchFeaturedArtisans]);

  // Get unique regions from artisans
  const regions = React.useMemo(() => {
    const allRegions = artisans.map(a => a.region || a.location?.split(',')[1]?.trim()).filter(Boolean);
    return [...new Set(allRegions)];
  }, [artisans]);

  // Filter artisans based on search and region
  const filteredArtisans = React.useMemo(() => {
    return artisans.filter(artisan => {
      const matchesSearch = !searchTerm || 
        artisan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artisan.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (artisan.specialties && artisan.specialties.some(s => 
          s.toLowerCase().includes(searchTerm.toLowerCase())
        ));
      
      const matchesRegion = selectedRegion === "all" || 
        artisan.region === selectedRegion ||
        artisan.location?.includes(selectedRegion);
      
      return matchesSearch && matchesRegion;
    });
  }, [artisans, searchTerm, selectedRegion]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-organic-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-organic-text to-organic-highlight text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-mountain-pattern opacity-10"></div>
        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-6">
            Meet Our Artisans
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
            Discover the master craftspeople behind every authentic product. 
            Each artisan carries forward generations of traditional knowledge from the heart of the Himalayas.
          </p>
        </div>
      </section>

      {/* Featured Artisans */}
      {featuredArtisans.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="font-display text-3xl font-bold text-organic-text mb-8 text-center">
              Featured Master Artisans
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredArtisans.slice(0, 3).map((artisan) => (
                <Link 
                  key={artisan.id} 
                  to={`/artisans/${artisan.id}`}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative">
                    <ResponsiveImage
                      src={artisan.profileImage}
                      alt={`${artisan.name} - Master Artisan`}
                      className="w-full h-64 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-organic-primary text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                        ⭐ Featured
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl font-bold text-organic-text mb-2">
                      {artisan.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <MapPinIcon className="w-4 h-4 text-organic-primary" />
                      <span className="text-organic-text opacity-75 text-sm">{artisan.location}</span>
                    </div>
                    <p className="text-organic-text opacity-75 mb-4 line-clamp-3">
                      {artisan.shortBio}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4 text-organic-highlight" />
                        <span className="text-sm text-organic-text">{artisan.experience} years</span>
                      </div>
                      {artisan.rating && (
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-organic-text">{artisan.rating}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search artisans by name, location, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-organic-primary focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-organic-primary focus:border-transparent"
              >
                <option value="all">All Regions</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* All Artisans */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl font-bold text-organic-text">
              All Artisans ({filteredArtisans.length})
            </h2>
          </div>
          
          {filteredArtisans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-organic-text opacity-75 text-lg mb-6">
                No artisans found matching your search criteria.
              </p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRegion("all");
                }}
                className="text-organic-primary hover:text-organic-text underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArtisans.map((artisan) => (
                <Link 
                  key={artisan.id} 
                  to={`/artisans/${artisan.id}`}
                  className="group bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <ResponsiveImage
                      src={artisan.profileImage}
                      alt={`${artisan.name} - Artisan`}
                      className="w-full h-48 group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    {artisan.featured && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-organic-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-organic-text mb-1 group-hover:text-organic-primary transition-colors">
                      {artisan.name}
                    </h3>
                    <div className="flex items-center gap-1 mb-2">
                      <MapPinIcon className="w-3 h-3 text-organic-primary" />
                      <span className="text-organic-text opacity-75 text-xs">{artisan.location}</span>
                    </div>
                    <p className="text-organic-text opacity-75 text-sm line-clamp-2 mb-3">
                      {artisan.shortBio}
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-organic-highlight font-medium">
                        {artisan.experience} years exp.
                      </span>
                      {artisan.specialties && (
                        <span className="text-organic-text opacity-75">
                          {artisan.specialties[0]}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Cultural Heritage Section */}
      <section className="py-16 bg-organic-text text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl font-bold mb-6">
            Preserving Himalayan Heritage
          </h2>
          <p className="text-xl leading-relaxed mb-8 max-w-3xl mx-auto">
            Every artisan in our network is a guardian of ancient traditions. 
            By supporting their work, you help preserve centuries-old craftsmanship 
            and ensure these skills are passed to future generations.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-organic-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏔️</span>
              </div>
              <h3 className="font-semibold mb-2">Mountain Communities</h3>
              <p className="text-sm opacity-75">Supporting remote Himalayan villages</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-organic-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="font-semibold mb-2">Traditional Crafts</h3>
              <p className="text-sm opacity-75">Preserving ancient techniques and knowledge</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-organic-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="font-semibold mb-2">Fair Trade</h3>
              <p className="text-sm opacity-75">Ensuring fair compensation for artisans</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}