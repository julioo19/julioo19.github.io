const About = () => {
  return (
    <section
      id="about"
      className="flex flex-col items-center justify-center px-6 py-24 text-center"
    >
      {/* Subtitulo */}
      <h2 className="font-pixel text-2xl text-white sm:text-3xl md:text-4xl">
        ABOUT ME
      </h2>

      {/* Descripcion */}
      <p className="mt-6 max-w-xl font-mono text-sm leading-relaxed text-white/70 sm:text-base">
        Java-focused backend developer who enjoys building systems from the
        ground up — from Spring Boot APIs to cross-platform apps with React
        Native. Currently open to new opportunities.
      </p>
    </section>
  )
}

export default About;