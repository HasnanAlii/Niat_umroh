import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Shield, ArrowRight, BookOpen, Target, Award, MapPin, Phone } from "lucide-react"
import { KonsultasiSection } from "@/components/KonsultasiSection"

export const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 mt-24">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        {/* Background Image with Gradient Overlay for better readability */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/80 to-gray-50 backdrop-blur-[2px]" />

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-6 bg-primary/10 text-primary hover:bg-primary/20 border-0 px-4 py-1.5 text-sm sm:text-base transition-colors rounded-full">
              ✨ Platform Resmi Niat Umroh
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight mb-6 text-gray-900 drop-shadow-sm">
              Wujudkan Impian Umroh
              <span className="block mt-2 text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-500">
                Dengan Tabungan Terencana
              </span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl mb-10 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed text-gray-600 px-4">
              Mulai persiapan ibadah umroh Anda dengan sistem tabungan digital yang aman, transparan, dan terpercaya. 
              Raih kemudahan menabung untuk perjalanan spiritual Anda bersama Niat Umroh.
            </p>

          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto mt-12 sm:mt-16 px-4">
            {[
              { value: "Rp500rb", label: "Setoran Minimal/Bulan" },
              { value: "12x", label: "Keberangkatan/Tahun" },
              { value: "100%", label: "Terjamin & Aman" },
              { value: "24/7", label: "Monitoring Tabungan" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-5 sm:p-8 rounded-2xl shadow-sm border border-gray-100 bg-white/80 backdrop-blur-md hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-primary group-hover:scale-105 transition-transform duration-300">
                  {stat.value}
                </div>
                <p className="text-xs sm:text-sm font-medium text-gray-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KEUNGGULAN SECTION */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Kenapa Memilih Niat Umroh?
            </h2>
            <p className="text-base sm:text-lg max-w-2xl mx-auto text-gray-500">
              Keunggulan yang membuat perjalanan spiritual Anda lebih terencana, tenang, dan terjamin.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {/* Array Map untuk mengurangi repetisi kodingan Card */}
            {[
              { icon: Shield, title: "Legalitas Resmi", desc: "Berizin Kementerian Agama & HIMPUH.", text: "Perusahaan resmi dengan jaminan keamanan tabungan." },
              { icon: BookOpen, title: "Fleksibel", desc: "Mulai Rp500.000 per bulan.", text: "Pilihan setoran fleksibel sesuai kemampuan finansial Anda." },
              { icon: Target, title: "Real-time", desc: "Pantau saldo kapan saja.", text: "Dashboard pribadi digital untuk memonitor tabungan 24/7." },
              { icon: Award, title: "Layanan Premium", desc: "Fasilitas bintang 5.", text: "Paket lengkap dengan hotel terbaik & pembimbing ahli." }
            ].map((item, index) => (
              <Card key={index} className="border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group bg-gray-50/50">
                <CardHeader>
                  <div className="mb-4 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                    <item.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="font-medium text-primary">
                    {item.desc}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* KONSULTASI */}
      <KonsultasiSection />

      {/* CTA SECTION */}
      <section className="relative py-16 sm:py-24 text-white overflow-hidden">
        {/* Background dengan warna Solid Primary dan Ornamen (Optional) */}
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

        <div className="container mx-auto text-center px-4 relative z-10">
          <div className="bg-white p-3 rounded-2xl inline-block mb-8 shadow-xl">
            <img
              src="/logo.png"
              alt="Niat Umroh"
              className="h-20 sm:h-28 object-contain"
            />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 drop-shadow-md">
            Mulai Perjalanan Spiritual Anda Sekarang
          </h2>

          <p className="max-w-2xl mx-auto text-primary-foreground/90 text-lg sm:text-xl mb-10">
            Jangan tunda impian bertemu Baitullah. Mulai menabung dengan mudah dan aman hari ini.
          </p>
          
          <Button size="lg" variant="secondary" className="rounded-full px-8 text-primary font-bold hover:scale-105 transition-transform duration-300 shadow-xl mb-12">
            Hubungi Customer Service
          </Button>

          <div className="max-w-3xl mx-auto mt-8 border-t border-white/20 pt-8 text-sm sm:text-base text-primary-foreground/80 flex flex-col md:flex-row justify-center gap-4 md:gap-12">
            <div className="flex items-center justify-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>Jl. Pangkaian Raya Gg. Dahlia, Bogor Utara</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Phone className="h-5 w-5" />
              <span>0878-7479-0441 (08:00 - 17:00 WIB)</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}