import { MessageCircle, X } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export const WhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  const whatsappNumber = "6287874790441" // Nomor Niat Umroh
  const defaultMessage = "Halo Niat Umroh, saya ingin berkonsultasi seputar umroh."

  const openWhatsApp = (message = defaultMessage) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  const quickMessages = [
    "Halo, saya ingin tanya tentang program Taburoh",
    "Bisa info paket umroh terbaru?",
    "Saya mau konsultasi dokumen umroh",
    "Ada jadwal keberangkatan bulan depan?",
    "Bisa bantu cek status tabungan saya?"
  ]

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {/* Quick Message Panel */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 w-72 bg-white rounded-xl shadow-2xl border animate-in slide-in-from-bottom-5">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Konsultasi Cepat</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Pilih pertanyaan atau tulis sendiri
              </p>
            </div>
            
            <div className="p-4 max-h-60 overflow-y-auto">
              <div className="space-y-2">
                {quickMessages.map((msg, idx) => (
                  <button
                    key={idx}
                    onClick={() => openWhatsApp(msg)}
                    className="w-full text-left p-3 text-sm border rounded-lg hover:border-primary hover:bg-blue-50 transition-colors"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => openWhatsApp()}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                Tulis Pesan Sendiri
              </Button>
            </div>
          </div>
        )}

        {/* Main WhatsApp Button */}
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 shadow-lg relative group"
        >
          <MessageCircle className="h-7 w-7" />
          
          {/* Ping Animation */}
          <span className="absolute inset-0 animate-ping bg-green-600 rounded-full opacity-20"></span>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
            <div className="bg-gray-900 text-white text-sm rounded-lg py-2 px-3 whitespace-nowrap">
              Konsultasi WhatsApp
              <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
            </div>
          </div>
        </Button>
      </div>

      {/* WhatsApp Badge */}
      <div className="fixed bottom-6 left-6 z-40 hidden md:block">
        <div className="bg-white rounded-xl shadow-lg p-4 border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-sm">Butuh Bantuan?</p>
              <p className="text-xs text-gray-600">Chat kami via WhatsApp</p>
            </div>
          </div>
          <Button 
            size="sm" 
            className="w-full mt-3 bg-green-600 hover:bg-green-700"
            onClick={() => openWhatsApp()}
          >
            Chat Sekarang
          </Button>
        </div>
      </div>
    </>
  )
}
