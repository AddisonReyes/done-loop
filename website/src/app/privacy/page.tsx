import type { Metadata } from "next";

import { LegalPage } from "../shared/legal-page";
import type { LegalContent, Localized } from "../shared/types";

const content = {
  en: {
    title: "Privacy Policy",
    updated: "Last updated: June 2, 2026",
    intro:
      "Done Loop is a local-first productivity app for habits, tasks, reminders, and personal routines. This Privacy Policy explains how Done Loop handles user data.",
    sections: [
      {
        title: "Developer",
        body: "Done Loop is developed by Addison Reyes. Privacy questions can be sent to addison.amin@gmail.com.",
      },
      {
        title: "Data collection",
        body: "Done Loop does not collect, transmit, sell, or share personal data with the developer or with third parties. Done Loop does not operate a backend server for storing user app data. The app does not provide user accounts, cloud sync, analytics, advertising, memberships, subscriptions, payments, or server-side storage.",
      },
      {
        title: "Local app data",
        body: "Done Loop stores habits, tasks, reminders, completion history, app settings, and customization preferences locally on your device. This data is used only to provide habit tracking, task management, reminder, progress tracking, and customization features. This data remains on your device and is not sent to the developer or to any server controlled by Done Loop.",
      },
      {
        title: "Internet access",
        body: "Done Loop does not require an internet connection for its core habit, task, reminder, progress tracking, and customization features.",
      },
      {
        title: "Notifications",
        body: "Done Loop may request notification permission if you enable reminders. This permission is used only to schedule local reminders for habits and tasks. Reminder content is generated on your device and is not sent to the developer or to a third-party server.",
      },
      {
        title: "Third-party services",
        body: "Done Loop does not use third-party analytics SDKs, advertising SDKs, tracking SDKs, crash reporting SDKs, or payment processors. Done Loop is distributed through Google Play. Google Play may process downloads, reviews, device information, crash information, and store interactions according to Google's own privacy policies and Google account settings.",
      },
      {
        title: "Data sharing",
        body: "Done Loop does not share your app data with the developer, advertisers, analytics providers, or other third parties.",
      },
      {
        title: "Data security",
        body: "Because Done Loop stores app data locally on your device, your data is protected by your device's operating system, device lock, and app storage protections. Done Loop does not transmit your habits, tasks, reminders, completion history, settings, or customization preferences over the internet.",
      },
      {
        title: "Retention and deletion",
        body: "Your Done Loop data remains on your device until you edit it, delete it, clear the app storage, or uninstall the app. You can delete individual habits and tasks inside the app. You can also delete local app data by uninstalling Done Loop or clearing the app's storage from your device settings.",
      },
      {
        title: "Accounts",
        body: "Done Loop does not allow users to create accounts. Because no account is created, there is no account deletion process. All app data is stored locally on the user's device.",
      },
      {
        title: "Children",
        body: "Done Loop is not specifically directed to children under the age of 13 and is not designed for use by children without parental supervision. Done Loop does not knowingly collect personal data from children. Since Done Loop does not collect personal data from any user, children's personal data is not collected, transmitted, sold, or shared by the app.",
      },
      {
        title: "Changes to this policy",
        body: "This Privacy Policy may be updated from time to time. The updated version will be posted on this page with a new Last updated date.",
      },
      {
        title: "Contact",
        body: "For privacy questions or requests, contact Addison Reyes at addison.amin@gmail.com. This Privacy Policy is available at https://done-loop.com/privacy.",
      },
    ],
  },
  es: {
    title: "Política de Privacidad",
    updated: "Última actualización: 2 de junio de 2026",
    intro:
      "Done Loop es una app de productividad local-first para hábitos, tareas, recordatorios y rutinas personales. Esta Política de Privacidad explica cómo Done Loop maneja los datos de los usuarios.",
    sections: [
      {
        title: "Desarrollador",
        body: "Done Loop es desarrollada por Addison Reyes. Las preguntas de privacidad pueden enviarse a addison.amin@gmail.com.",
      },
      {
        title: "Recolección de datos",
        body: "Done Loop no recolecta, transmite, vende ni comparte datos personales con el desarrollador ni con terceros. Done Loop no opera un servidor backend para almacenar datos de usuario de la app. La app no ofrece cuentas de usuario, sincronización en la nube, analytics, publicidad, membresías, suscripciones, pagos ni almacenamiento del lado del servidor.",
      },
      {
        title: "Datos locales de la app",
        body: "Done Loop guarda hábitos, tareas, recordatorios, historial de completado, ajustes de la app y preferencias de personalización localmente en tu dispositivo. Estos datos se usan solo para ofrecer funciones de seguimiento de hábitos, gestión de tareas, recordatorios, seguimiento de progreso y personalización. Estos datos permanecen en tu dispositivo y no se envían al desarrollador ni a ningún servidor controlado por Done Loop.",
      },
      {
        title: "Acceso a internet",
        body: "Done Loop no requiere conexión a internet para sus funciones principales de hábitos, tareas, recordatorios, seguimiento de progreso y personalización.",
      },
      {
        title: "Notificaciones",
        body: "Done Loop puede solicitar permiso de notificaciones si activas recordatorios. Este permiso se usa solo para programar recordatorios locales de hábitos y tareas. El contenido de los recordatorios se genera en tu dispositivo y no se envía al desarrollador ni a un servidor de terceros.",
      },
      {
        title: "Servicios de terceros",
        body: "Done Loop no usa SDKs de analytics de terceros, SDKs de publicidad, SDKs de tracking, SDKs de crash reporting ni procesadores de pago. Done Loop se distribuye a través de Google Play. Google Play puede procesar descargas, reseñas, información del dispositivo, información de fallos e interacciones con la tienda de acuerdo con las políticas de privacidad de Google y los ajustes de la cuenta de Google.",
      },
      {
        title: "Compartición de datos",
        body: "Done Loop no comparte los datos de tu app con el desarrollador, anunciantes, proveedores de analytics ni otros terceros.",
      },
      {
        title: "Seguridad de los datos",
        body: "Debido a que Done Loop guarda los datos de la app localmente en tu dispositivo, tus datos están protegidos por el sistema operativo del dispositivo, el bloqueo del dispositivo y las protecciones de almacenamiento de la app. Done Loop no transmite tus hábitos, tareas, recordatorios, historial de completado, ajustes ni preferencias de personalización por internet.",
      },
      {
        title: "Retención y eliminación",
        body: "Tus datos de Done Loop permanecen en tu dispositivo hasta que los edites, los elimines, borres el almacenamiento de la app o desinstales la app. Puedes eliminar hábitos y tareas individuales dentro de la app. También puedes eliminar los datos locales de la app desinstalando Done Loop o borrando el almacenamiento de la app desde los ajustes de tu dispositivo.",
      },
      {
        title: "Cuentas",
        body: "Done Loop no permite que los usuarios creen cuentas. Como no se crea ninguna cuenta, no existe un proceso de eliminación de cuenta. Todos los datos de la app se guardan localmente en el dispositivo del usuario.",
      },
      {
        title: "Menores",
        body: "Done Loop no está dirigida específicamente a menores de 13 años y no está diseñada para ser usada por menores sin supervisión parental. Done Loop no recolecta de forma consciente datos personales de menores. Dado que Done Loop no recolecta datos personales de ningún usuario, los datos personales de menores no son recolectados, transmitidos, vendidos ni compartidos por la app.",
      },
      {
        title: "Cambios a esta política",
        body: "Esta Política de Privacidad puede actualizarse ocasionalmente. La versión actualizada se publicará en esta página con una nueva fecha de Última actualización.",
      },
      {
        title: "Contacto",
        body: "Para preguntas o solicitudes de privacidad, contacta a Addison Reyes en addison.amin@gmail.com. Esta Política de Privacidad está disponible en https://done-loop.com/privacy.",
      },
    ],
  },
} satisfies Localized<LegalContent>;

export const metadata: Metadata = {
  title: "Privacy Policy | Done Loop",
  description:
    "Privacy Policy for Done Loop, a local-first habits and tasks app.",
};

export default function PrivacyPage() {
  return <LegalPage content={content} />;
}
