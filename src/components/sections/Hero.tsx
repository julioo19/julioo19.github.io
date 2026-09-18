import Button from '../ui/Button';
import Marquee from './Marquee';

function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center px-6 pt-16 pb-24 text-center md:min-h-screen md:px-0">
      
      {/* Headline */}
      <h1 className="font-pixel text-3xl leading-tight text-white sm:text-4xl md:text-6xl lg:text-7xl">
        JULIO CESAR
        <br/>
        MONTALVAN 
      </h1>

      {/* CTA */}
      <div className="mt-8">
        <Button href="#projects">SEE MY PROJECTS</Button>
      </div>

      {/* Marquee infinito */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden py-4">
        {<Marquee />}
      </div>
    </section>
  );
}

export default Hero;