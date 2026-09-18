import Navbar from "./components/layout/Navbar"
import About from "./components/sections/About"
import Hero from "./components/sections/Hero"
const App = () => {
  return (
    <main>
        <div className="min-h screen bg-dark overflow-hidden">
          <Navbar/>
          <Hero/>
          <About/>
        </div>
    </main>
  )
}

export default App