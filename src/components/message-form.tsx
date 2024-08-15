'use client'

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'

import { Send, Upload } from 'lucide-react'

import Message from '@/types/Message'
import useFileStore from '@/stores/FileStore'
import FormFile from './form-file-preview'
import { IconButton } from '@radix-ui/themes'

export default function MessageForm({
  replyFileIds,
  onSubmit
}: {
  replyFileIds: string[]
  onSubmit: (message: Message) => void
}) {
  const [text, setText] = useState<string>('')
  const [fileIds, setFileIds] = useState<string[]>([])
  const textInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const fileStore = useFileStore()

  useEffect(() => {
    const newFileIds = [...new Set(fileIds.concat(replyFileIds))]
    setFileIds(newFileIds)
  }, [replyFileIds])

  const handleFileInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return
    const files = Array.from(event.target.files)
    const fileIds = files.map(() => crypto.randomUUID())
    fileStore.addFiles(fileIds, files)
    setFileIds(fileIds)
    textInputRef.current?.focus()
    event.target.value = ''
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit({ id: crypto.randomUUID(), type: 'Request', text, fileIds })
    setText('')
    setFileIds([])
  }

  const handleFileError = (fileId: string) => {
    const file = fileStore.getFile(fileId)
    if (!file) {
      alert('Error while uploading files, please try again')
      setFileIds([])
      return
    }
    alert(`Error reading file: ${file.name}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute flex flex-col h-14 bottom-12 rounded-[26px] md:w-1/2 w-11/12 border-gray-400 border-2"
      ref={formRef}
    >
      {fileIds.length !== 0 && (
        <div className="m-5 flex flex-wrap gap-6 max-h-64 overflow-y-scroll scroll-m-11 justify-between after:flex-auto">
          {fileIds.map(fileId => (
            <FormFile
              key={fileId}
              fileId={fileId}
              onError={handleFileError}
              onRemove={fileId =>
                setFileIds(fileIds.filter(id => id !== fileId))
              }
            />
          ))}
        </div>
      )}
      <div className="w-full h-full flex flex-row items-center justify-center">
        <IconButton onClick={() => fileInputRef.current?.click()}>
          <Upload />
        </IconButton>
        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          hidden
        />
        <input
          className="bg-transparent outline-none w-full"
          type="text"
          spellCheck="false"
          required
          value={text}
          ref={textInputRef}
          onChange={e => setText(e.target.value)}
        />
        <input type="submit" hidden />
        <IconButton type="submit" disabled={text.trim() === ''}>
          <Send />
        </IconButton>
      </div>
    </form>
  )
}
