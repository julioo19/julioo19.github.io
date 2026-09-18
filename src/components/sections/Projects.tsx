const projects = [
  { name: 'AI Tourism Agent' },
  { name: 'Food Delivery App' },
  { name: 'Machinery Accreditation System' },
];

const Projects = () => {
  return (
    <section
      id="projects"
      className="flex flex-col items-center justify-center px-6 py-24 text-center"
    >
      {/* Subtitulo */}
      <h2 className="font-pixel text-2xl text-white sm:text-3xl md:text-4xl">
        PROJECTS
      </h2>

      {/* Grid de proyectos */}
      <ul className="mt-10 grid w-full max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
        {projects.map(({ name }) => (
          <li key={name} className="flex flex-col">
            {/* Placeholder de imagen */}
            <div className="aspect-video w-full border border-white/10 bg-white/5" />

            {/* Nombre del proyecto */}
            <span className="mt-3 font-mono text-xs uppercase tracking-widest text-white/70">
              {name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Projects;