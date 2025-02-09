import React from "react";
import Link from "next/link";
import {
  MapPin,
  Users,
  Calendar,
  Search,
  ArrowRight,
  LogIn,
} from "lucide-react";
import Image from "next/image";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed w-full bg-green-700 shadow-sm z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-white">Fairmeet</h1>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white hover:text-gray-100"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Accedi
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-16 text-center bg-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-white sm:text-5xl md:text-6xl">
            Scopri Trento come mai prima
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-white sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            La tua guida personale per eventi, luoghi di interesse e attività
            nella città di Trento
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link
              href="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-700 hover:bg-green-800 md:text-lg"
            >
              Inizia ora
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="p-6 bg-white rounded-lg shadow-lg border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Localizzazione accurata
              </h3>
              <p className="mt-2 text-gray-500">
                Trova eventi e luoghi di interesse vicino a te con la nostra
                funzione di geolocalizzazione
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-white rounded-lg shadow-lg border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Eventi centralizzati
              </h3>
              <p className="mt-2 text-gray-500">
                Tutti gli eventi della città in un unico posto, organizzati e
                facilmente accessibili
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-white rounded-lg shadow-lg border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                Coinvolgimento sociale
              </h3>
              <p className="mt-2 text-gray-500">
                Crea gruppi e partecipa ad eventi con amici e altri cittadini
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Vantaggi per i cittadini
            </h2>
            <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
              Scopri come TrentoConnect può migliorare la tua esperienza nella
              città
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Ricerca efficiente
              </h3>
              <p className="mt-2 text-gray-500">
                Filtri personalizzati per trovare eventi basati sui tuoi
                interessi, tempo e posizione
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900">
                Valorizzazione del territorio
              </h3>
              <p className="mt-2 text-gray-500">
                Scopri parchi, musei, monumenti storici e spazi verdi della
                città
              </p>
            </div>
          </div>

          {/* Institutional Section */}
          <div className="mt-16 text-center">
            <p className="text-lg font-medium text-gray-900 mb-8">
              Realizzato per il comune di Trento come progetto
              dell&apos;università di Trento
            </p>
            <div className="flex justify-center items-center space-x-8">
              <div className="w-32 h-32">
                <Image
                  src="/ctn.png"
                  alt="Comune di Trento"
                  width={510}
                  height={242}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="w-32 h-32">
                <Image
                  src="/unitn.png"
                  width={714}
                  height={242}
                  alt="Università di Trento"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-green-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white">
              Unisciti alla community di Trento
            </h2>
            <p className="mt-4 text-xl text-green-100">
              Inizia a scoprire tutto ciò che la città ha da offrirti
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50 md:text-lg"
              >
                Registrati ora
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-400 text-sm">
            © 2025 Fairmeet. Tutti i diritti riservati.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
