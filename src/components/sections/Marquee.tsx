const text = 'ESTUDIANTE DE 9no CICLO EN LA UNIVERSIDAD RICARDO PALMA ⟨/⟩';

const Marquee = () => {
  return (
    <div className="flex w-max animate-marquee">
      <span className="mx-4 whitespace-nowrap font-mono text-sm uppercase tracking-widest text-white/40">
        {text} {text} {text} {text}
      </span>
      <span className="mx-4 whitespace-nowrap font-mono text-sm uppercase tracking-widest text-white/40">
        {text} {text} {text} {text}
      </span>
    </div>
  );
};

export default Marquee;