import type { Metadata } from 'next';
import LegalPage from '@/components/layout/LegalPage';

export const metadata: Metadata = {
  title: 'Políticas de Privacidad — Wave Project Gym',
  description: 'Política de privacidad y tratamiento de datos personales de Wave Project Gym, Concón, Chile.',
};

export default function PrivacidadPage() {
  return (
    <LegalPage
      chip="LEGAL"
      title="POLÍTICAS DE PRIVACIDAD"
      updated="12 de julio de 2026"
      intro="En Wave Project Gym respetamos tu privacidad. Esta política describe qué datos personales recopilamos, con qué finalidad y cuáles son tus derechos, conforme a la Ley N° 19.628 sobre Protección de la Vida Privada de Chile."
      blocks={[
        {
          h: 'Datos que recopilamos',
          p: [
            'Recopilamos los datos que nos entregas al comprar una preventa: nombre, correo electrónico, teléfono y los datos necesarios para procesar el pago.',
            'Los datos de pago (tarjetas, cuentas) son gestionados directamente por MercadoPago. Wave Project Gym no almacena ni tiene acceso a esa información sensible.',
          ],
        },
        {
          h: 'Finalidad del tratamiento',
          p: [
            'Utilizamos tus datos para: procesar tu compra, confirmar tu cupo, enviarte información sobre la apertura y el inicio de tu plan, y brindarte soporte.',
            'Con tu consentimiento, podremos enviarte comunicaciones sobre novedades y beneficios. Puedes darte de baja en cualquier momento.',
          ],
        },
        {
          h: 'Conservación y seguridad',
          p: [
            'Conservamos tus datos mientras dure tu relación con el Gimnasio y por los plazos que exija la normativa aplicable.',
            'Aplicamos medidas técnicas y organizativas razonables para proteger tus datos frente a accesos no autorizados, pérdida o alteración.',
          ],
        },
        {
          h: 'Terceros',
          p: [
            'Compartimos datos únicamente con los proveedores necesarios para operar el servicio (por ejemplo, la plataforma de pago MercadoPago y el proveedor de correo transaccional), quienes los tratan según sus propias políticas.',
            'No vendemos ni cedemos tus datos personales a terceros con fines publicitarios.',
          ],
        },
        {
          h: 'Tus derechos',
          p: [
            'Puedes ejercer tus derechos de acceso, rectificación, cancelación y oposición sobre tus datos personales.',
            'Para ejercerlos, escríbenos a waveprojectchile@gmail.com. Responderemos tu solicitud en los plazos que establece la ley.',
          ],
        },
        {
          h: 'Cookies',
          p: [
            'Este sitio puede utilizar cookies técnicas necesarias para su funcionamiento y para mejorar tu experiencia de navegación. Puedes configurar tu navegador para rechazarlas, aunque ello podría afectar algunas funciones.',
          ],
        },
      ]}
    />
  );
}
