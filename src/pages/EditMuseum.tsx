import { useParams } from 'react-router-dom'
export default function EditMuseum(){
  const {id}=useParams()
  return <div className="min-h-screen bg-[#10131a] text-[#f2f4f8] p-6">Tahrirlash #{id} (tez orada)</div>
}
