import Navbar from "./components/layout/Navbar"
import About from "./components/sections/About"
import Hero from "./components/sections/Hero"
import Projects from "./components/sections/Projects"
import Skills from "./components/sections/Skills"
const App = () => {
  return (
    <main>
        <div className="min-h screen bg-dark overflow-hidden">
          <Navbar/>
          <Hero/>
          <About/>
          <Skills/>
          <Projects/>
        </div>
    </main>
  )
}

export default App