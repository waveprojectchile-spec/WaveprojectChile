import type { Metadata } from 'next';
import LegalPage from '@/components/layout/LegalPage';

export const metadata: Metadata = {
  title: 'Términos y Condiciones — Wave Project Gym',
  description: 'Términos y condiciones de la preventa de Wave Project Gym, Concón, Chile.',
};

export default function TerminosPage() {
  return (
    <LegalPage
      chip="LEGAL"
      title="TÉRMINOS Y CONDICIONES"
      updated="12 de julio de 2026"
      intro="Estos Términos y Condiciones regulan la compra de planes de preventa de Wave Project Gym (en adelante, el Gimnasio), ubicado en Calle 6 235, Concón, Región de Valparaíso, Chile. Al completar una compra, el usuario declara haber leído y aceptado estas condiciones."
      blocks={[
        {
          h: 'Objeto de la preventa',
          p: [
            'La preventa consiste en la reserva anticipada de un cupo y un plan de membresía en el Gimnasio, a un precio especial de lanzamiento, antes de su apertura oficial.',
            'El número de cupos de esta etapa es limitado a 50. Una vez agotados, no se comercializarán cupos adicionales en esta etapa de preventa.',
          ],
        },
        {
          h: 'Precios y pagos',
          p: [
            'Todos los precios se expresan en pesos chilenos (CLP) e incluyen los impuestos aplicables.',
            'Los pagos se procesan a través de MercadoPago. Wave Project Gym no almacena datos de tarjetas; el procesamiento es responsabilidad de la plataforma de pago.',
            'La compra se considera confirmada una vez que MercadoPago aprueba la transacción y el usuario recibe el correo de confirmación con su número de cupo.',
          ],
        },
        {
          h: 'Vigencia e inicio del plan',
          p: [
            'El plan adquirido comienza a regir a partir de la fecha de apertura oficial del Gimnasio, la cual será comunicada por correo electrónico con anticipación.',
            'La duración del plan (mensual, trimestral, semestral o anual) se cuenta desde dicha fecha de inicio, no desde la fecha de compra.',
          ],
        },
        {
          h: 'Renovaciones',
          p: [
            'El precio de preventa es renovable hasta 4 veces, manteniendo el valor especial de lanzamiento en las renovaciones sucesivas dentro de las condiciones vigentes.',
            'El cambio de modalidad de plan solo podrá realizarse al momento de una renovación, no durante un período ya adquirido.',
          ],
        },
        {
          h: 'Derecho de retracto y reembolsos',
          p: [
            'Conforme a la Ley N° 19.496 sobre Protección de los Derechos de los Consumidores, el usuario podrá ejercer los derechos que dicha normativa le reconoce.',
            'Las solicitudes de reembolso deben dirigirse a waveprojectchile@gmail.com indicando el número de cupo y el comprobante de pago. Cada solicitud se evaluará según la etapa en que se encuentre y la normativa aplicable.',
          ],
        },
        {
          h: 'Responsabilidad',
          p: [
            'El uso de las instalaciones estará sujeto al reglamento interno del Gimnasio, que será entregado al inicio de la membresía.',
            'Wave Project Gym no se hace responsable por lesiones derivadas del uso inadecuado de los equipos o del incumplimiento de las indicaciones del personal.',
          ],
        },
        {
          h: 'Modificaciones',
          p: [
            'Wave Project Gym podrá actualizar estos Términos y Condiciones. La versión vigente será siempre la publicada en este sitio, con su respectiva fecha de actualización.',
          ],
        },
      ]}
    />
  );
}
