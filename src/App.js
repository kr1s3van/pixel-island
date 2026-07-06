import React, { useState, useEffect } from 'react';
import Shuffle from './components/Shuffle/Shuffle';
import PixelTransition from './components/PixelTransition/PixelTransition';
import CardSwap, { Card } from './components/CardSwap/CardSwap'; // Importation
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ShoppingCart, Search, Gamepad, Monitor, Package, Sparkles, Download, Palette, Ghost, ArrowDown, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRODUCTS = [
  { id: 1, name: "Animal Crossing: New Horizons", price: 79.99, platform: "Nintendo", type: "Physique", img: "/assets/Animal Crossing.jpeg" },
  { id: 2, name: "Halo Infinite", price: 59.50, platform: "Xbox", type: "Numérique", img: "/assets/Halo Infinite.jpeg" },
  { id: 3, name: "Spider-Man 2", price: 89, platform: "Playstation", type: "Physique", img: "/assets/Marvel.jpeg" },
  { id: 4, name: "Zelda: Tears of the Kingdom", price: 89, platform: "Nintendo", type: "Physique", img: "/assets/Zelda TOTK.jpeg" },
  { id: 5, name: "Kit Pixel Art - Tom Nook", price: 25, platform: "Nintendo", type: "Pixel Art", img: "/assets/Pixel Art.jpeg" },
  { id: 6, name: "Abonnement Game Pass(Essntial)", price: 105.5, platform: "Xbox", type: "Numérique", img: "/assets/Game Pass.jpeg" },
  { id: 7, name: "Undertale", price: 45, platform: "Nintendo", type: "Numérique", img: "/assets/Undertale.jpeg" },
  { id: 8, name: "Crash Bandicoot", price: 60.50, platform: "Playstation", type: "Physique", img: "/assets/Crash.jpeg" },
  { id: 9, name: "Abonnement Nintendo Switch Online", price: 30, platform: "Nintendo", type: "Numérique", img: "/assets/Nintedo Switch Online.jpeg" },
  { id: 10, name: "Final Fest T-Shirt", price: 65, platform: "Nintendo", type: "Merch", img: "/assets/Final Fest T-shirt.jpeg" },
  { id: 11, name: "The champions- Amiibo", price: 149.99, platform: "Nintendo", type: "Physique", img: "/assets/Amiibo.jpeg" },
  { id: 12, name: "Pro controller", price: 65.55, platform: "Xbox", type: "Physique", img: "/assets/Controller.jpeg" },
];

const App = () => {
  const [stage, setStage] = useState('welcome'); 
  const [cart, setCart] = useState([]);
  const [filters, setFilters] = useState({ platform: [], type: [] });
  const [tempFilters, setTempFilters] = useState({ platform: [], type: [] }); 
  const [isScrolling, setIsScrolling] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [rating, setRating] = useState(0); 
  const [deliveryMethod, setDeliveryMethod] = useState('delivery'); 

  const interestsList = [
    { label: "Nintendo", value: "Nintendo", icon: <Sparkles size={20}/> },
    { label: "Playstation", value: "Playstation", icon: <Gamepad size={20}/> },
    { label: "Xbox", value: "Xbox", icon: <Monitor size={20}/> },
    { label: "Merch", value: "Merch", icon: <Package size={20}/> },
    { label: "Physique", value: "Physique", icon: <Package size={20}/> },
    { label: "Numérique", value: "Numérique", icon: <Download size={20}/> },
    { label: "Pixel Art", value: "Pixel Art", icon: <Palette size={20}/> },
    { label: "Aventure", value: "Aventure", icon: <Ghost size={20}/> },
  ];

  useEffect(() => {
    const handleWheel = (e) => {
      if (isScrolling) return;
      if (e.deltaY > 50) { 
        if (stage === 'welcome') {
          setIsScrolling(true);
          setStage('interests');
          setTimeout(() => setIsScrolling(false), 1000);
        }
      }
    };
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [stage, isScrolling]);

  const handleInterestToggle = (val) => {
    const isPlatform = ["Nintendo", "Playstation", "Xbox"].includes(val);
    const category = isPlatform ? 'platform' : 'type';
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(val) ? prev[category].filter(i => i !== val) : [...prev[category], val]
    }));
  };

  // Synchroniser les filtres temporaires au chargement de la boutique
  useEffect(() => {
    if (stage === 'browse') setTempFilters(filters);
  }, [stage, filters]);

  const toggleTempFilter = (category, value) => {
    setTempFilters(prev => {
      const current = prev[category];
      const next = current.includes(value) ? current.filter(i => i !== value) : [...current, value];
      return { ...prev, [category]: next };
    });
  };

  const applyFilters = () => {
    setFilters(tempFilters);
  };

  const filteredProducts = PRODUCTS.filter(p => {
    const platformMatch = filters.platform.length === 0 || filters.platform.includes(p.platform);
    const typeMatch = filters.type.length === 0 || filters.type.includes(p.type);
    return platformMatch && typeMatch;
  });

  return (
    <div className="app-container">
      <AnimatePresence mode="wait">
        
        {stage === 'welcome' && (
          <motion.div key="welcome" className="onboarding-screen" exit={{ opacity: 0 }}>
            <h1 className="welcome-title"><Shuffle text="PIXEL ISLAND" /></h1>
            <p className="pixel-text opacity-75 mt-2">FAIS DEFILER POUR COMMENCER</p>
            <div className="mt-5 animate-bounce text-wood"><ArrowDown size={50} /></div>
          </motion.div>
        )}

        {stage === 'interests' && (
          <motion.div key="interests" className="onboarding-screen" initial={{ y: 100 }} animate={{ y: 0 }}>
            <h2 className="pixel-subtitle">TES PREFERENCES</h2>
            <div className="d-flex flex-wrap justify-content-center gap-3 mb-5" style={{ maxWidth: '900px' }}>
              {interestsList.map(item => (
                <div key={item.label} className={`interest-card p-4 rounded-3 shadow-sm ${filters.platform.includes(item.value) || filters.type.includes(item.value) ? 'active' : ''}`} onClick={() => handleInterestToggle(item.value)}>
                  <div className="mb-2">{item.icon}</div>
                  <div className="pixel-text-small">{item.label}</div>
                </div>
              ))}
            </div>
            <button className="btn-island shadow-sm" onClick={() => setStage('transitioning')}>C'EST PARTI !</button>
          </motion.div>
        )}

        {stage === 'transitioning' && <PixelTransition key="pixel" onComplete={() => setStage('browse')} />}

        {stage === 'browse' && (
          <motion.div key="shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <nav className="navbar p-3 shadow-sm sticky-top" style={{ backgroundColor: 'var(--mint)' }}>
              <div className="container">
                <span className="navbar-brand fw-bold text-wood">PIXEL ISLAND</span>
                <div className="d-flex align-items-center">
                  <button className="btn btn-white rounded-pill shadow-sm" onClick={() => setCheckoutStep(1)}>
                    <ShoppingCart size={24} color="#5C4033" />
                    <span className="ms-2 badge bg-dark rounded-pill">{cart.length}</span>
                  </button>
                </div>
              </div>
            </nav>

            <div className="container mt-5">

              {/* --- ETAPE 0 : TA BOUTIQUE (On l'affiche si checkoutStep est 0) --- */}
              {checkoutStep === 0 && (
                <div className="row">
                  {/* SIDEBAR FILTRES */}
                  <div className="col-md-3">
                    <div className="sidebar-nook p-4 rounded-4 shadow-sm">
                      <h5 className="pixel-text mb-4 border-bottom border-wood pb-2"><Search size={20} /> FILTRES</h5>
                      <p className="fw-bold mb-2 pixel-text-small text-success">CONSOLES</p>
                      {['Nintendo', 'Playstation', 'Xbox'].map(cat => (
                        <div key={cat} className="form-check mb-2">
                          <input className="form-check-input nook-check" type="checkbox" checked={tempFilters.platform.includes(cat)} onChange={() => toggleTempFilter('platform', cat)} />
                          <label className="form-check-label pixel-text-small">{cat}</label>
                        </div>
                      ))}
                      <p className="fw-bold mt-4 mb-2 pixel-text-small text-success">FORMAT</p>
                      {['Physique', 'Numérique', 'Merch'].map(t => (
                        <div key={t} className="form-check mb-2">
                          <input className="form-check-input nook-check" type="checkbox" checked={tempFilters.type.includes(t)} onChange={() => toggleTempFilter('type', t)} />
                          <label className="form-check-label pixel-text-small">{t}</label>
                        </div>
                      ))}
                      <button className="btn-island w-100 mt-4 py-2" onClick={applyFilters}>APPLIQUER</button>
                    </div>
                  </div>

                  <div className="col-md-9">
                    {/* MESSAGE DE BIENVENUE */}
                    <div className="speech-bubble mb-5 p-4 rounded-4">
                      <p className="pixel-text-small mb-0">"Hey gamer ! On a sélectionné quelques pépites rien que pour toi. Regarde nos Nouveautés ici et Shop un peu plus bas!"</p>
                    </div>

                    {/* SECTION CARDSWAP */}
                    <div className="featured-section mb-5">
                      <CardSwap cardDistance={40} verticalDistance={30} delay={4000}>
                        {PRODUCTS.slice(0, 3).map(p => (
                          <Card key={p.id} className="text-center">
                            <img src={p.img} alt={p.name} />
                            <h6 className="pixel-text-small mt-3">{p.name}</h6>
                            <span className="fw-bold text-success">{p.price}$</span>
                          </Card>
                        ))}
                      </CardSwap>
                    </div>

                    <hr className="my-5" />
                    <h5 className="pixel-text mb-4">FAIT TOI PLAISIR! :3 </h5>
                    <div className="row g-4">
                      {filteredProducts.map(product => (
                        <div key={product.id} className="col-md-6 col-lg-4">
                          <div className="card h-100 product-card shadow-sm rounded-4 border-2-wood">
                            <img src={product.img} className="card-img-top rounded-top-4" style={{ height: '180px', objectFit: 'cover' }} alt={product.name} />
                            <div className="card-body">
                              <p className="pixel-text-small text-muted mb-1">{product.platform} • {product.type}</p>
                              <h6 className="fw-bold mb-3">{product.name}</h6>
                              <div className="d-flex justify-content-between align-items-center">
                                <span className="fs-5 fw-bold text-wood">{product.price} $</span>
                                <button className="btn rounded-pill px-3 fw-bold btn-add" onClick={() => setCart([...cart, product])}>+</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* --- ETAPE 1 : LE PANIER --- */}
              {checkoutStep === 1 && (
                <div className="checkout-container rounded-4 shadow p-5">
                  <p className="step-indicator">ÉTAPE 1 SUR 3 : TON PANIER </p>
                  <h2 className="pixel-subtitle border-bottom pb-3 text-uppercase">Récapitulatif</h2>
                  {cart.length === 0 ? <p className="mt-4">Ton panier est vide...</p> : (
                    <div className="mt-4">
                      {cart.map((item, i) => (
                        <div key={i} className="d-flex justify-content-between mb-3 pixel-text-small">
                          <span>{item.name}</span>
                          <span className="fw-bold">{item.price}$</span>
                        </div>
                      ))}
                      <div className="h4 fw-bold mt-5 border-top pt-3">TOTAL : {cart.reduce((s, i) => s + i.price, 0)}$</div>
                    </div>
                  )}
                  <div className="d-flex justify-content-between mt-5">
                    <button className="btn btn-outline-dark rounded-pill px-4" onClick={() => setCheckoutStep(0)}>RETOUR</button>
                    <button className="btn-island" disabled={cart.length === 0} onClick={() => setCheckoutStep(2)}>PAYER</button>
                  </div>
                </div>
              )}

              {/* --- ETAPE 2 : LE PAIEMENT --- */}
              {checkoutStep === 2 && (
                <div className="checkout-container rounded-4 shadow p-5">
                  <p className="step-indicator">ÉTAPE 2 SUR 3 : INFOS & PAIEMENT</p>
                  <h2 className="pixel-subtitle mb-3 text-uppercase">Mode de réception</h2>
                  <div className="d-flex gap-2 mb-4">
                    <button 
                      className={`delivery-option ${deliveryMethod === 'delivery' ? 'active' : ''}`}
                      onClick={() => setDeliveryMethod('delivery')}
                    >
                      LIVRAISON 
                    </button>
                    <button 
                      className={`delivery-option ${deliveryMethod === 'pickup' ? 'active' : ''}`}
                      onClick={() => setDeliveryMethod('pickup')}
                    >
                      PICK-UP 
                    </button>
                  </div>

                  <h2 className="pixel-subtitle mb-3 text-uppercase">Tes Infos</h2>
                  <input className="nook-input mb-3" placeholder="NOM COMPLET" />
                  {deliveryMethod === 'delivery' ? (
                    <input className="nook-input mb-4" placeholder="ADRESSE DE L'ÎLE" />
                  ) : (
                    <div className="p-3 border-2-wood bg-light mb-4 pixel-text-small">
                      Point de retrait : Boutique de Tom Nook (Place de la Mairie)
                    </div>
                  )}

                  <h2 className="pixel-subtitle mb-3 text-uppercase">Paiement</h2>
                  <div className="p-3 border-2-wood rounded bg-light d-flex align-items-center gap-3">
                    <CreditCard size={32} />
                    <input className="bg-transparent border-0 w-100" placeholder="XXXX XXXX XXXX XXXX" />
                  </div>
                  <button className="btn-island w-100 mt-5" onClick={() => setCheckoutStep(3)}>VALIDER L'ACHAT</button>
                </div>
              )}  

              {/* --- ETAPE 3 : LE SONDAGE (Indispensable pour le devoir) --- */}
              {checkoutStep === 3 && (
                <div className="checkout-container rounded-4 shadow text-center p-5">
                  <h1 className="pixel-subtitle text-success mb-3 text-uppercase">Succès ! </h1>
                  <p className="pixel-text-small">Ta commande est en route via Dodo Airlines !</p>
                  <div className="mt-5 p-4 border-2-wood rounded-4 bg-white shadow-sm">
                    <h5 className="pixel-text-small fw-bold mb-3">TON AVIS COMPTE !</h5>
                    <p className="small mb-4 text-muted">Note ton expérience de 1 à 5 :</p>
                    <div className="d-flex justify-content-center gap-3 mb-4">
                      {[1, 2, 3, 4, 5].map(n => (
                        <button 
                          key={n} 
                          className={`rating-btn ${rating === n ? 'active' : ''}`} 
                          onClick={() => setRating(n)}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                    <textarea className="nook-input mb-4" placeholder="Un petit mot doux pour l'équipe ?" rows="3"></textarea>
                    <button className="btn-island w-100" onClick={() => {setCheckoutStep(0); setCart([]);}}>ENVOYER & RETOURNER A L'ACCUEIL</button>
                  </div>
                </div>
              )}
            </div>

            
            
            <footer className="text-center py-5 mt-5 border-top bg-white">
               <p className="pixel-text-small text-muted">Pixel Island - Kris-Evan N'Guéssant</p>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;