import { useEffect, useState } from 'react';

// Tipo de un mensaje tal como lo devuelve la API
interface Mensaje {
  id: number;
  nombre: string;
  mensaje: string;
  fecha: string;
}

const API = '/api';

const Guestbook = () => {
  // Lista de mensajes traidos de la API
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);

  // Controla si la seccion se muestra. Arranca en false: "degradacion elegante".
  // Si la API no responde (ej. en GitHub Pages), esto nunca cambia a true
  // y la seccion jamas se renderiza.
  const [visible, setVisible] = useState(false);

  // Texto de feedback del formulario ("Enviando...", "Gracias...", error, etc.)
  const [estado, setEstado] = useState('');

  // Se ejecuta una sola vez, al montar el componente.
  // Intenta cargar los mensajes; si tiene exito, recien ahi se muestra la seccion.
  useEffect(() => {
    const cargar = async () => {
      try {
        const r = await fetch(`${API}/mensajes`, {
          headers: { Accept: 'application/json' },
        });
        // En GitHub Pages /api/mensajes da 404 en HTML: eso NO es la API real.
        const esJson = (r.headers.get('content-type') || '').includes(
          'application/json'
        );
        if (!r.ok || !esJson) throw new Error(`API no disponible (HTTP ${r.status})`);

        const data: Mensaje[] = await r.json();
        setMensajes(data);
        setVisible(true);
      } catch (err) {
        // Silencioso a proposito: si falla, la seccion simplemente no aparece.
        console.info('Libro de visitas oculto:', err);
      }
    };

    cargar();
  }, []);

  // Vuelve a pedir la lista completa a la API (se usa despues de enviar un mensaje nuevo)
  const recargarMensajes = async () => {
    const r = await fetch(`${API}/mensajes`, {
      headers: { Accept: 'application/json' },
    });
    const data: Mensaje[] = await r.json();
    setMensajes(data);
  };

  // Se dispara al enviar el formulario
  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const datos = Object.fromEntries(new FormData(form));

    setEstado('Enviando...');
    try {
      const r = await fetch(`${API}/mensajes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos),
      });
      const cuerpo = await r.json();
      if (!r.ok) throw new Error(cuerpo.error || `HTTP ${r.status}`);

      form.reset();
      setEstado('¡Gracias por tu mensaje!');
      await recargarMensajes();
    } catch (err) {
      setEstado(`No se pudo enviar: ${(err as Error).message}`);
    }
  };

  // Si la API nunca respondio bien, no se renderiza nada de esta seccion.
  if (!visible) return null;

  return (
    <section
      id="libro-de-visitas"
      className="flex flex-col items-center justify-center px-6 py-24 text-center"
    >
      {/* Subtitulo */}
      <h2 className="font-pixel text-2xl text-white sm:text-3xl md:text-4xl">
        Leave your message!
      </h2>

      {/* Formulario para dejar un mensaje nuevo */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 grid w-full max-w-md gap-3 text-left"
      >
        <label className="grid gap-1 font-mono text-sm text-white/70">
          Tu nombre
          <input
            className="rounded-md border border-white/10 bg-white/5 p-2 font-mono text-white"
            name="nombre"
            maxLength={60}
            required
          />
        </label>

        <label className="grid gap-1 font-mono text-sm text-white/70">
          Tu mensaje
          <textarea
            className="rounded-md border border-white/10 bg-white/5 p-2 font-mono text-white"
            name="mensaje"
            maxLength={280}
            rows={3}
            required
          />
        </label>

        <button
          type="submit"
          className="justify-self-start rounded-md bg-accent px-4 py-2 font-mono text-dark transition-colors hover:bg-white"
        >
          Enviar
        </button>

        {/* Texto de feedback: "Enviando...", "Gracias...", o un error */}
        {estado && (
          <p role="status" className="font-mono text-xs text-white/50">
            {estado}
          </p>
        )}
      </form>

      {/* Lista de mensajes existentes */}
      <ul className="mt-8 grid w-full max-w-md gap-3 text-left">
        {mensajes.map((m) => (
          <li
            key={m.id}
            className="rounded-md border border-white/10 bg-white/5 p-3"
          >
            <strong className="font-mono text-white">{m.nombre}</strong>
            <time className="ml-2 font-mono text-xs text-white/50">
              {new Date(m.fecha).toLocaleString('es-PE')}
            </time>
            <p className="mt-1 font-mono text-sm text-white/70">{m.mensaje}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Guestbook;