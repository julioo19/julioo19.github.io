import { FaJava } from 'react-icons/fa';
import {
  SiSpringboot,
  SiTypescript,
  SiReact,
  SiPython,
  SiPostgresql,
} from 'react-icons/si';

const skills = [
  { name: 'Java', icon: FaJava },
  { name: 'Spring Boot', icon: SiSpringboot },
  { name: 'TypeScript', icon: SiTypescript },
  { name: 'React Native', icon: SiReact },
  { name: 'Python', icon: SiPython },
  { name: 'PostgreSQL', icon: SiPostgresql },
];

const Skills = () => {
  return (
    <section
      id="skills"
      className="flex flex-col items-center justify-center px-6 py-24 text-center"
    >
      {/* Subtitulo */}
      <h2 className="font-pixel text-2xl text-white sm:text-3xl md:text-4xl">
        Skills
      </h2>

      {/* Grid de tecnologias */}
      <ul className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {skills.map(({ name, icon: Icon }) => (
          <li
            key={name}
            className="flex w-40 flex-col items-center justify-center gap-3 border border-white/10 bg-white/5 py-6"
          >
            <Icon className="h-10 w-10 text-accent" />
            <span className="font-mono text-xs uppercase tracking-widest text-white/70">
              {name}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Skills;