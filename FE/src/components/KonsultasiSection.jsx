import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageCircle, CheckCircle, Users } from "lucide-react"

export const KonsultasiSection = () => {
  const openWhatsApp = () => {
    const msg = "Halo Niat Umroh, saya ingin berkonsultasi seputar umroh."
    const url = `https://wa.me/6287874790441?text=${encodeURIComponent(msg)}`
    window.open(url, "_blank")
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">

        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Konsultasi Umroh Gratis
          </h2>

          <p className="text-gray-600 max-w-xl mx-auto">
            Tim kami siap membantu menjawab semua pertanyaan Anda
            mengenai paket umroh, tabungan, hingga persiapan ibadah.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">

          <Card>
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2"/>
              <CardTitle>Tim Berpengalaman</CardTitle>
              <CardDescription>
                Konsultan berpengalaman siap membantu Anda.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <MessageCircle className="h-8 w-8 text-primary mb-2"/>
              <CardTitle>Respons Cepat</CardTitle>
              <CardDescription>
                Konsultasi via WhatsApp dengan respon cepat.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CheckCircle className="h-8 w-8 text-primary mb-2"/>
              <CardTitle>Gratis</CardTitle>
              <CardDescription>
                Konsultasi gratis tanpa biaya.
              </CardDescription>
            </CardHeader>
          </Card>

        </div>

        <div className="text-center mt-10">
          <Button
            size="lg"
            className="bg-green-600 hover:bg-green-700"
            onClick={openWhatsApp}
          >
            <MessageCircle className="h-5 w-5 mr-2"/>
            Konsultasi via WhatsApp
          </Button>
        </div>

      </div>
    </section>
  )
}