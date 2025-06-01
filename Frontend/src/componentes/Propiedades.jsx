"use client";
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Clock, Plus, Edit, Trash2 } from 'lucide-react';

// Función para formatear moneda
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(value);
};

// Procesar datos de propiedades
const procesarDatosPropiedades = (propiedades) => {
  // Rangos de precios
  const rangosPrecios = [
    { rango: '< $100M', cantidad: propiedades.filter(p => p.precio < 100000000).length },
    { rango: '$100M - $200M', cantidad: propiedades.filter(p => p.precio >= 100000000 && p.precio < 200000000).length },
    { rango: '$200M - $500M', cantidad: propiedades.filter(p => p.precio >= 200000000 && p.precio < 500000000).length },
    { rango: '$500M - $1B', cantidad: propiedades.filter(p => p.precio >= 500000000 && p.precio < 1000000000).length },
    { rango: '> $1B', cantidad: propiedades.filter(p => p.precio >= 1000000000).length }
  ];

  // Propiedades recientes (últimas 5)
  const propiedadesRecientes = propiedades.slice(-5).reverse();

  return {
    rangosPrecios,
    propiedadesRecientes
  };
};

export default function DashboardInmobiliario() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newPropiedad, setNewPropiedad] = useState({
    direccion: '',
    tipo: { id: '' },
    operacion: { id: '' },
    estado: { id: '' },
    precio: 0,
    latitud: 0,
    longitud: 0,
    idVendedor: ''
  });
  const [tiposPropiedad, setTiposPropiedad] = useState([]);
  const [operaciones, setOperaciones] = useState([]);
  const [estadosPropiedad, setEstadosPropiedad] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingPropiedad, setEditingPropiedad] = useState(null);

  const API_BASE = 'http://localhost:8094/api/propiedades';

  // Cargar datos iniciales (propiedades, tipos, operaciones, estados)
  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        propiedadesResponse,
        tiposResponse,
        operacionesResponse,
        estadosResponse,
      ] = await Promise.all([
        fetch(API_BASE),
        fetch(`${API_BASE}/tipos`),
        fetch(`${API_BASE}/operaciones`),
        fetch(`${API_BASE}/estados`),
      ]);

      if (!propiedadesResponse.ok) throw new Error('Error al cargar propiedades');
      if (!tiposResponse.ok) throw new Error('Error al cargar tipos de propiedad');
      if (!operacionesResponse.ok) throw new Error('Error al cargar operaciones');
      if (!estadosResponse.ok) throw new Error('Error al cargar estados');

      const propiedades = await propiedadesResponse.json();
      const tipos = await tiposResponse.json();
      const operacionesData = await operacionesResponse.json();
      const estados = await estadosResponse.json();

      const data = procesarDatosPropiedades(propiedades);
      setDashboardData(data);
      setTiposPropiedad(tipos);
      setOperaciones(operacionesData);
      setEstadosPropiedad(estados);
      setError(null);
    } catch (err) {
      setError('Error al cargar los datos');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers para el formulario de agregar
  const handleAgregarClick = () => {
    setIsAdding(true);
    setNewPropiedad({
      direccion: '',
      tipo: { id: tiposPropiedad[0]?.idTipo || '' },
      operacion: { id: operaciones[0]?.idOperacion || '' },
      estado: { id: estadosPropiedad[0]?.idEstado || '' },
      precio: 0,
      latitud: 0,
      longitud: 0,
      idVendedor: ''
    });
  };

  const handleAgregarInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('tipo.') || name.startsWith('operacion.') || name.startsWith('estado.')) {
      const [relation, field] = name.split('.');
      setNewPropiedad(prev => ({
        ...prev,
        [relation]: { ...prev[relation], [field]: value },
      }));
    } else {
      setNewPropiedad(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGuardarNuevaPropiedad = async () => {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newPropiedad,
          tipo: { idTipo: parseInt(newPropiedad.tipo.id) },
          operacion: { idOperacion: parseInt(newPropiedad.operacion.id) },
          estado: { idEstado: parseInt(newPropiedad.estado.id) },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al agregar propiedad: ${JSON.stringify(errorData)}`);
      }

      setIsAdding(false);
      fetchData(); // Recargar datos después de agregar
    } catch (err) {
      setError(err.message);
      console.error('Error al agregar propiedad:', err);
    }
  };

  const handleCancelarAgregar = () => {
    setIsAdding(false);
  };

  // Handlers para el formulario de editar
  const handleEditarClick = (id) => {
    const propiedadAEditar = dashboardData?.propiedadesRecientes?.find(p => p.id === id);
    if (propiedadAEditar) {
      setEditingId(id);
      setEditingPropiedad({
        idPropiedad: propiedadAEditar.id,
        direccion: propiedadAEditar.direccion,
        precio: propiedadAEditar.precio,
        tipo: { id: propiedadAEditar.tipo?.id },
        operacion: { id: propiedadAEditar.operacion?.id },
        estado: { id: propiedadAEditar.estado?.id },
        latitud: propiedadAEditar.latitud,
        longitud: propiedadAEditar.longitud,
        idVendedor: propiedadAEditar.idVendedor
      });
      setIsAdding(true); // Reutilizamos el modal de agregar para editar
    }
  };

  const handleEditarInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('tipo.') || name.startsWith('operacion.') || name.startsWith('estado.')) {
      const [relation, field] = name.split('.');
      setEditingPropiedad(prev => ({
        ...prev,
        [relation]: { ...prev[relation], [field]: value },
      }));
    } else {
      setEditingPropiedad(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleGuardarEdicion = async () => {
    if (!editingId || !editingPropiedad) return;
    try {
      const response = await fetch(`${API_BASE}/${editingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...editingPropiedad,
          tipo: { idTipo: parseInt(editingPropiedad.tipo.id) },
          operacion: { idOperacion: parseInt(editingPropiedad.operacion.id) },
          estado: { idEstado: parseInt(editingPropiedad.estado.id) },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error al editar propiedad ${editingId}: ${JSON.stringify(errorData)}`);
      }

      setEditingId(null);
      setEditingPropiedad(null);
      setIsAdding(false);
      fetchData(); // Recargar datos después de editar
    } catch (err) {
      setError(err.message);
      console.error(`Error al editar propiedad ${editingId}:`, err);
    }
  };

  // Handler para eliminar
  const handleEliminarClick = async (id) => {
    if (window.confirm('¿Seguro que deseas eliminar esta propiedad?')) {
      try {
        const response = await fetch(`${API_BASE}/${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Error al eliminar propiedad ${id}: ${JSON.stringify(errorData)}`);
        }

        fetchData(); // Recargar datos después de eliminar
      } catch (err) {
        setError(err.message);
        console.error(`Error al eliminar propiedad ${id}:`, err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">Cargando datos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 p-4 rounded-md mx-4 my-6">
        <p className="text-red-700">{error}</p>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={fetchData}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Gráfica de Rangos de Precio */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Distribución por Rangos de Precio</h3>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dashboardData?.rangosPrecios || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="rango" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="cantidad" fill="#ff7c7c" name="Cantidad de Propiedades" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabla de Propiedades Recientes */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Clock className="mr-2" size={20} />
            Propiedades Registradas Recientemente
          </h3>
          <button
            className="flex items-center bg-blue-500 text-#343a40 px-4 py-2 rounded hover:bg-blue-600  background-color:#A94442"
            onClick={handleAgregarClick}
          >
            <Plus className="mr-2" size={18} />
            Agregar Propiedad
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                {/*<th className="py-3 px-4 text-left text-sm font-medium text-gray-600">ID</th>*/}
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Dirección</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Tipo</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Operación</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Estado</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-600">Precio</th>
                <th className="py-3 px-4 text-center text-sm font-medium text-gray-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {dashboardData?.propiedadesRecientes?.length ? (
                dashboardData.propiedadesRecientes.map((propiedad) => (
                  <tr key={propiedad.id} className="hover:bg-gray-50">
                   {/* <td className="py-4 px-4 text-sm">{propiedad.id}</td>*/}
                    <td className="py-4 px-4 text-sm">{propiedad.direccion}</td>
                    <td className="py-4 px-4 text-sm">{propiedad?.tipo?.nombre}</td>
                    <td className="py-4 px-4 text-sm">{propiedad?.operacion?.nombre}</td>
                    <td className="py-4 px-4 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        propiedad?.estado?.nombre?.toLowerCase()?.includes('disponible')
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {propiedad?.estado?.nombre}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm font-semibold">
                      {formatCurrency(propiedad.precio)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        className="inline-flex items-center text-blue-500 hover:text-blue-700 mr-2"
                        title="Editar"
                        onClick={() => handleEditarClick(propiedad.id)}
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        className="inline-flex items-center text-red-500 hover:text-red-700"
                        title="Eliminar"
                        onClick={() => handleEliminarClick
                          (propiedad.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-4 px-4 text-center text-gray-500">
                    No hay propiedades registradas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Agregar/Editar Propiedad */}
      {(isAdding || editingId) && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-8">
            <h2 className="text-lg font-semibold mb-4">{editingId ? 'Editar Propiedad' : 'Agregar Nueva Propiedad'}</h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="direccion">
                Dirección:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="direccion"
                type="text"
                name="direccion"
                value={editingId ? editingPropiedad?.direccion : newPropiedad.direccion}
                onChange={editingId ? handleEditarInputChange : handleAgregarInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="precio">
                Precio:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="precio"
                type="number"
                name="precio"
                value={editingId ? editingPropiedad?.precio : newPropiedad.precio}
                onChange={editingId ? handleEditarInputChange : handleAgregarInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tipo.id">
                Tipo de Propiedad:
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="tipo.id"
                name="tipo.id"
                value={editingId ? editingPropiedad?.tipo?.id : newPropiedad.tipo.id}
                onChange={editingId ? handleEditarInputChange : handleAgregarInputChange}
              >
                {tiposPropiedad.map((tipo) => (
                  <option key={tipo.idTipo} value={tipo.idTipo}>
                    {tipo.nombreTipoPropiedad}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="operacion.id">
                Operación:
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="operacion.id"
                name="operacion.id"
                value={editingId ? editingPropiedad?.operacion?.id : newPropiedad.operacion.id}
                onChange={editingId ? handleEditarInputChange : handleAgregarInputChange}
              >
                {operaciones.map((operacion) => (
                  <option key={operacion.idOperacion} value={operacion.idOperacion}>
                    {operacion.nombreOperacion}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="estado.id">
                Estado:
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="estado.id"
                name="estado.id"
                value={editingId ? editingPropiedad?.estado?.id : newPropiedad.estado.id}
                onChange={editingId ? handleEditarInputChange : handleAgregarInputChange}
              >
                {estadosPropiedad.map((estado) => (
                  <option key={estado.idEstado} value={estado.idEstado}>
                    {estado.nombreEstadoPropiedad}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="latitud">
                Latitud:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="latitud"
                type="number"
                name="latitud"
                value={editingId ? editingPropiedad?.latitud : newPropiedad.latitud}
                onChange={editingId ? handleEditarInputChange : handleAgregarInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="longitud">
                Longitud:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="longitud"
                type="number"
                name="longitud"
                value={editingId ? editingPropiedad?.longitud : newPropiedad.longitud}
                onChange={editingId ? handleEditarInputChange : handleAgregarInputChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="idVendedor">
                ID Vendedor:
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="idVendedor"
                type="number"
                name="idVendedor"
                value={editingId ? editingPropiedad?.idVendedor : newPropiedad.idVendedor}
                onChange={editingId ? handleEditarInputChange : handleAgregarInputChange}
              />
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                onClick={() => {
                  setIsAdding(false);
                  setEditingId(null);
                  setEditingPropiedad(null);
                }}
              >
                Cancelar
              </button>
              <button
                className={`px-4 py-2 rounded ${editingId ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                onClick={editingId ? handleGuardarEdicion : handleGuardarNuevaPropiedad}
              >
                {editingId ? 'Guardar Cambios' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

