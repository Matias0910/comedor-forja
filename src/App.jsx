import { useState, useMemo, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import RegistrationForm from "./RegistrationForm";

function App() {
  const [registros, setRegistros] = useState(() => {
    const savedRegistros = localStorage.getItem("registros");
    return savedRegistros ? JSON.parse(savedRegistros) : [];
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("registros", JSON.stringify(registros));
  }, [registros]);

  const handleSave = (data) => {
    if (editingId) {
      const updatedData = {
        ...data,
        adultos: Number(data.adultos) || 0,
        menores: Number(data.menores) || 0,
      };
      setRegistros(registros.map(r => (r.id === editingId ? { ...r, ...updatedData } : r)));
      setEditingId(null);
    } else {
      const nuevoRegistro = {
        ...data,
        adultos: Number(data.adultos) || 0,
        menores: Number(data.menores) || 0,
        fecha: new Date().toLocaleDateString(),
        id: Date.now()
      };
      setRegistros(prevRegistros => [...prevRegistros, nuevoRegistro]);
    }
  };

  const eliminarRegistro = (id) => {
    setRegistros(registros.filter(r => r.id !== id));
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const editingRecord = useMemo(
    () => editingId ? registros.find(r => r.id === editingId) : null,
    [editingId, registros]
  );

  const resumenMensual = useMemo(
    () =>
      registros.reduce(
        (acc, r) => {
          acc.adultos += Number(r.adultos) || 0;
          acc.menores += Number(r.menores) || 0;
          acc.familias += 1;
          return acc;
        },
        { adultos: 0, menores: 0, familias: 0 }
      ),
    [registros]
  );

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Comedor FORJA Morón - Registros", 14, 15);

    autoTable(doc, {
      head: [["Fecha","Nombre y Apellido","Adultos","Menores","Dirección","Teléfono"]],
      body: registros.map(r => [
        r.fecha || '',
        r.nombreApellido || '',
        r.adultos?.toString() || '0',
        r.menores?.toString() || '0',
        r.direccion || '',
        r.telefono || ''
      ]),
      startY: 25,
    });

    const finalY = doc.lastAutoTable.finalY || 30;
    doc.text("Resumen mensual:", 14, finalY + 10);
    doc.text(`Total de familias: ${resumenMensual.familias}`, 14, finalY + 20);
    doc.text(`Total de adultos: ${resumenMensual.adultos}`, 14, finalY + 30);
    doc.text(`Total de menores: ${resumenMensual.menores}`, 14, finalY + 40);

    doc.output('dataurlnewwindow');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
          <h1 className="text-3xl font-bold text-green-700 flex items-center gap-3">
            <span className="text-4xl">🍲</span> Comedor FORJA Morón
          </h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 border-b pb-2">
          {editingId ? "Editando familia" : "Registrar familia"}
        </h2>
        <RegistrationForm
          key={editingId || registros.length} 
          onSave={handleSave}
          editingRecord={editingRecord}
          onCancelEdit={handleCancelEdit}
        />
      </main>

      <section className="max-w-5xl mx-auto mt-10 px-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">📋 Registros</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {registros.slice().reverse().map((r) => (
            <div key={r.id} className="bg-white shadow-md rounded-xl p-5 border-t-4 border-green-500">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-green-800 mb-2">{r.nombreApellido}</h3>
                <span className="text-xs font-semibold text-gray-500 bg-gray-200 px-2 py-1 rounded-full">{r.fecha}</span>
              </div>
              <div className="text-gray-600 space-y-1 mt-3">
                <p><span className="font-bold">👨 Adultos:</span> {r.adultos}</p>
                <p><span className="font-bold">👶 Menores:</span> {r.menores}</p>
                {r.direccion && <p><span className="font-bold">🏠 Dirección:</span> {r.direccion}</p>}
                {r.telefono && <p><span className="font-bold">📞 Teléfono:</span> {r.telefono}</p>}
              </div>
              <div className="mt-4 flex gap-3 border-t pt-3">
                <button onClick={() => handleEdit(r.id)} className="w-full bg-yellow-500 text-white px-3 py-2 rounded-lg">✏️ Editar</button>
                <button onClick={() => eliminarRegistro(r.id)} className="w-full bg-red-600 text-white px-3 py-2 rounded-lg">🗑️ Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">📊 Resumen General</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="bg-green-100 p-6 rounded-xl">
            <p className="text-5xl">👨‍👩‍👧‍👦</p>
            <p className="text-xl font-bold mt-2">Familias</p>
            <p className="text-3xl font-semibold text-green-800">{resumenMensual.familias}</p>
          </div>
          <div className="bg-blue-100 p-6 rounded-xl">
            <p className="text-5xl">👨</p>
            <p className="text-xl font-bold mt-2">Adultos</p>
            <p className="text-3xl font-semibold text-blue-800">{resumenMensual.adultos}</p>
          </div>
          <div className="bg-pink-100 p-6 rounded-xl">
            <p className="text-5xl">👶</p>
            <p className="text-xl font-bold mt-2">Menores</p>
            <p className="text-3xl font-semibold text-pink-800">{resumenMensual.menores}</p>
          </div>
        </div>
        <div className="text-center mt-8 border-t pt-6">
          <button onClick={exportarPDF} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg shadow-md">
            📄 Previsualizar y Exportar PDF
          </button>
        </div>
      </section>
    </div>
  );
}

export default App;

