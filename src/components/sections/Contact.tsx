import { FaGithub, FaEnvelope } from 'react-icons/fa';

const contacts = [
  {
    name: 'GitHub',
    icon: FaGithub,
    href: 'https://github.com/julioo19', // TODO: reemplazar con tu link real de GitHub
  },
  {
    name: 'Email',
    icon: FaEnvelope,
    href: 'mailto:202020468@urp.edu.pe', // TODO: reemplazar con tu correo institucional
  },
];

const Contact = () => {
  return (
    <section
      id="contact"
      className="flex flex-col items-center justify-center px-6 py-24 text-center"
    >
      {/* Subtitulo */}
      <h2 className="font-pixel text-2xl text-white sm:text-3xl md:text-4xl">
        Contact me!
      </h2>

      {/* Cajas de contacto */}
      <ul className="mt-10 flex flex-col items-center gap-4 md:flex-row">
        {contacts.map(({ name, icon: Icon, href }) => (
          <li key={name}>
            <a
              href={href}
              target='_blank'
              rel="noopener noreferrer"
              className="group flex w-40 flex-col items-center justify-center gap-3 border border-white/10 bg-white/5 py-6 transition-colors duration-200 hover:border-accent"
            >
              <Icon className="h-10 w-10 text-accent transition-colors duration-200 group-hover:text-white" />
              <span className="font-mono text-xs uppercase tracking-widest text-white/70">
                {name}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Contact;