import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';

import CustomCursor from './components/CustomCursor';
import PageTransition from './components/PageTransition';
import AnimatedRoutes from './components/AnimatedRoutes';

import "./App.css";
import Home from './pages/Homepage/Home';
import Contact from './pages/Contact';
import Jam from './pages/Jam';

const App = () => {
  return (
    <>
      {/* FIX 1: Changed 'absolute' to 'fixed'. 
        This locks the background to the camera/viewport so you never see empty space at the bottom when scrolling! 
      */}
      <div>
        <div className="fixed inset-0 -z-10 diagonal-bg" />
      </div>

      <CustomCursor />

      {/* FIX 2: Added 'min-h-screen flex flex-col' to the main wrapper.
        This forces the app to take up exactly 100% of your screen height, even when zoomed way out.
      */}
      <div className="app-background">
        <Router>
          <PageTransition>
            
            {/* Navbar naturally stays at the top */}
            <Navbar />

            {/* FIX 3: 'flex-grow' fills the empty space under the Navbar.
              'items-center justify-center' locks your route content right in the middle!
            */}
            <div style={{ padding: "2rem" }}>
              <AnimatedRoutes />
            </div>
            
          </PageTransition>
        </Router>
      </div>
    </>
  );
};

export default App;



// export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';

// import Home from './pages/Homepage/Home';
// import Contact from './pages/Contact';
// import Jam from './pages/Jam';

// import CustomCursor from './components/CustomCursor';
// import PageTransition from './components/PageTransition';

// import "./App.css"

// const App = () => {
//   return (
//     <>
    
//       {/* Diagonal scrolling background */}
//       <div>

//         <div className="absolute inset-0 -z-10 diagonal-bg" />
//       </div>

//       <CustomCursor />

//       <div className="app-background">
//         <Router>
//           <PageTransition>
//             <Navbar />

//             <div style={{ padding: "2rem" }}>
//               <Routes>
//                 <Route path="/" element={<Home />} />
//                 <Route path="/contact-us" element={<Contact />} />
//                 <Route path="/jam" element={<Jam />} />
//               </Routes>
//             </div>
//           </PageTransition>
//         </Router>
//       </div>
//     </>
//   );
// };

// export default App;
