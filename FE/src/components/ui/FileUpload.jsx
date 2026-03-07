import { useRef, useState } from "react"
import { Upload, X, File, CheckCircle, Loader2, AlertCircle } from "lucide-react"
import { Button } from "./button"
import { cn } from "@/lib/utils"

export const FileUpload = ({ 
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSize = 5 * 1024 * 1024, // 5MB default
  onFileSelect,
  onUpload,
  isUploading = false,
  uploadProgress = 0,
  existingFile = null,
  className
}) => {
  const fileInputRef = useRef(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState(null)

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  // Validate file
  const validateFile = (file) => {
    setError(null)

    // Check file size
    if (file.size > maxSize) {
      setError(`File terlalu besar. Maksimal ${formatFileSize(maxSize)}`)
      return false
    }

    // Check file type
    const acceptedTypes = accept.split(',').map(type => type.trim())
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
    const fileType = file.type

    const isValidType = acceptedTypes.some(type => {
      if (type.startsWith('.')) {
        return fileExtension === type
      }
      return fileType.match(type.replace('*', '.*'))
    })

    if (!isValidType) {
      setError(`Tipe file tidak didukung. Format yang diterima: ${accept}`)
      return false
    }

    return true
  }

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file && validateFile(file)) {
      setSelectedFile(file)
      if (onFileSelect) {
        onFileSelect(file)
      }
    }
  }

  // Handle drag events
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  // Handle drop
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (validateFile(file)) {
        setSelectedFile(file)
        if (onFileSelect) {
          onFileSelect(file)
        }
      }
    }
  }

  // Handle upload
  const handleUpload = () => {
    if (selectedFile && onUpload) {
      onUpload(selectedFile)
    }
  }

  // Clear selection
  const clearSelection = () => {
    setSelectedFile(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Get file icon based on type
  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop().toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
      return '🖼️'
    } else if (ext === 'pdf') {
      return '📄'
    }
    return '📎'
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Upload Area */}
      {!selectedFile && !existingFile && (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
            dragActive ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary hover:bg-gray-50",
            isUploading && "pointer-events-none opacity-50"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
            disabled={isUploading}
          />

          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-full">
              <Upload className="h-8 w-8 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {dragActive ? "Lepaskan file di sini" : "Klik atau drag & drop file"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Format: {accept} • Maks: {formatFileSize(maxSize)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="text-3xl">
                {getFileIcon(selectedFile.name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
              </div>
            </div>
            {!isUploading && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Mengupload... {uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Button */}
          {!isUploading && onUpload && (
            <Button
              onClick={handleUpload}
              className="w-full"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
          )}
        </div>
      )}

      {/* Existing File Display */}
      {existingFile && !selectedFile && (
        <div className="border border-green-200 bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-green-900">{existingFile.name || 'File Terupload'}</p>
                <p className="text-sm text-green-700">
                  {existingFile.uploadedAt ? `Upload: ${existingFile.uploadedAt}` : 'Sudah diupload'}
                </p>
              </div>
            </div>
            {existingFile.url && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(existingFile.url, '_blank')}
              >
                <File className="h-4 w-4 mr-2" />
                Lihat
              </Button>
            )}
          </div>
          
          {/* Change File Button */}
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-3"
            onClick={() => fileInputRef.current?.click()}
          >
            Ganti File
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  )
}
