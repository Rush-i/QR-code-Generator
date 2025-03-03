"use client"

import type React from "react"

import { useState, useRef } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download } from "lucide-react"

const downloadQRCode = (dataUrl: string, format: string) => {
  const link = document.createElement("a")
  link.href = dataUrl
  link.download = `qrcode.${format.toLowerCase()}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export default function QRCodeGenerator() {
  const [url, setUrl] = useState("https://v0-portfolio-ten-steel.vercel.app/")
  const [qrCode, setQRCode] = useState("https://v0-portfolio-ten-steel.vercel.app/")
  const [color, setColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")
  const [size, setSize] = useState(200)
  const [errorCorrection, setErrorCorrection] = useState("M")

  const qrCodeRef = useRef<SVGSVGElement>(null)

  const generateQRCode = (e: React.FormEvent) => {
    e.preventDefault()
    setQRCode(url)
  }

  const downloadAsSVG = () => {
    if (!qrCodeRef.current) return

    const svgData = new XMLSerializer().serializeToString(qrCodeRef.current)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const svgUrl = URL.createObjectURL(svgBlob)

    downloadQRCode(svgUrl, "svg")
    URL.revokeObjectURL(svgUrl)
  }

  const downloadAsPNG = () => {
    if (!qrCodeRef.current) return

    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      const pngUrl = canvas.toDataURL("image/png")
      downloadQRCode(pngUrl, "png")
    }

    const svgData = new XMLSerializer().serializeToString(qrCodeRef.current)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    img.src = URL.createObjectURL(svgBlob)
    img.crossOrigin = "anonymous"
  }

  const downloadAsJPEG = () => {
    if (!qrCodeRef.current) return

    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Fill with white background first (for JPEG)
    ctx.fillStyle = backgroundColor
    ctx.fillRect(0, 0, size, size)

    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      const jpegUrl = canvas.toDataURL("image/jpeg", 0.9)
      downloadQRCode(jpegUrl, "jpg")
    }

    const svgData = new XMLSerializer().serializeToString(qrCodeRef.current)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    img.src = URL.createObjectURL(svgBlob)
    img.crossOrigin = "anonymous"
  }

  const downloadAsPDF = () => {
    if (!qrCodeRef.current) return

    const canvas = document.createElement("canvas")
    canvas.width = size
    canvas.height = size

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      ctx.drawImage(img, 0, 0)

      // Create a new window for the PDF
      const pdfWindow = window.open("", "_blank")
      if (!pdfWindow) return

      // Create a simple HTML with the image
      pdfWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>QR Code PDF</title>
            <style>
              body { margin: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
              .container { text-align: center; }
              img { max-width: 100%; height: auto; }
              @media print {
                .no-print { display: none; }
                body { height: auto; }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <img src="${canvas.toDataURL("image/png")}" alt="QR Code" />
              <div class="no-print" style="margin-top: 20px;">
                <button onclick="window.print()">Print PDF</button>
              </div>
            </div>
            <script>
              // Auto print
              setTimeout(() => window.print(), 500);
            </script>
          </body>
        </html>
      `)
      pdfWindow.document.close()
    }

    const svgData = new XMLSerializer().serializeToString(qrCodeRef.current)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    img.src = URL.createObjectURL(svgBlob)
    img.crossOrigin = "anonymous"
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundColor: "#ADBBDA",
      }}
    >
      <Card className="w-full max-w-2xl bg-[#3D52A0]/40 backdrop-blur-md border border-white/20 shadow-lg">
        <CardHeader className="text-white">
          <CardTitle className="text-2xl font-bold text-center">QR Code Generator</CardTitle>
        </CardHeader>
        <CardContent className="text-white">
          <form onSubmit={generateQRCode} className="space-y-4">
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="Enter a URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="w-full bg-white/20 text-white placeholder-white/50 backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-white/30 focus:ring-2 focus:ring-[#0FA4AF]"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="color">QR Code Color</Label>
                <Input
                  id="color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-10 transition-all duration-300 ease-in-out hover:opacity-80"
                />
              </div>
              <div>
                <Label htmlFor="backgroundColor">Background Color</Label>
                <Input
                  id="backgroundColor"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-full h-10 transition-all duration-300 ease-in-out hover:opacity-80"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="size">
                Size: {size}x{size}
              </Label>
              <Slider
                id="size"
                min={100}
                max={400}
                step={10}
                value={[size]}
                onValueChange={(value) => setSize(value[0])}
                className="w-full"
              />
            </div>
            <div>
              <Label htmlFor="errorCorrection">Error Correction Level</Label>
              <Select value={errorCorrection} onValueChange={setErrorCorrection}>
                <SelectTrigger
                  id="errorCorrection"
                  className="bg-white/20 text-white backdrop-blur-sm transition-all duration-300 ease-in-out hover:bg-white/30"
                >
                  <SelectValue placeholder="Select error correction level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">Low (7%)</SelectItem>
                  <SelectItem value="M">Medium (15%)</SelectItem>
                  <SelectItem value="Q">Quartile (25%)</SelectItem>
                  <SelectItem value="H">High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              className="w-full bg-[#2A1B3D] text-white transition-all duration-300 ease-in-out hover:bg-[#003135]/80 hover:scale-105"
            >
              Generate QR Code
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-white">
          {qrCode && (
            <div className="mt-4 flex flex-col items-center">
              <QRCodeSVG
                value={qrCode}
                size={size}
                fgColor={color}
                bgColor={backgroundColor}
                level={errorCorrection}
                includeMargin={true}
                ref={qrCodeRef}
              />
              <div className="mt-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className="bg-[#2A1B3D] text-white transition-all duration-300 ease-in-out hover:bg-[#003135]/80 hover:scale-105">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={downloadAsSVG}>Download as SVG</DropdownMenuItem>
                    <DropdownMenuItem onClick={downloadAsPNG}>Download as PNG</DropdownMenuItem>
                    <DropdownMenuItem onClick={downloadAsJPEG}>Download as JPEG</DropdownMenuItem>
                    <DropdownMenuItem onClick={downloadAsPDF}>Download as PDF</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

