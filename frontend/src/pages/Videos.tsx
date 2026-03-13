import { useState, useEffect } from 'react';
import { videosAPI, materiasAPI } from '../api';
import { Video, Materia } from '../types';
import { PlayCircle, CheckCircle, Video as VideoIcon, Filter, ExternalLink } from 'lucide-react';

export default function Videos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroMateria, setFiltroMateria] = useState<number | 'todas'>('todas');
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'vistos' | 'pendientes'>('todos');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [vData, mData] = await Promise.all([
        videosAPI.getAll(),
        materiasAPI.getAll(),
      ]);
      setVideos(vData);
      setMaterias(mData);
    } catch (error) {
      console.error('Error fetching videos data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleVisto = async (id: number) => {
    try {
      const updatedVideo = await videosAPI.toggleVisto(id);
      setVideos(videos.map(v => v.id === id ? updatedVideo : v));
    } catch (error) {
      console.error('Error toggling video status:', error);
    }
  };

  const videosFiltrados = videos.filter(v => {
    const cumpleMateria = filtroMateria === 'todas' || v.materiaId === filtroMateria;
    const cumpleEstado =
      filtroEstado === 'todos' ||
      (filtroEstado === 'vistos' && v.visto) ||
      (filtroEstado === 'pendientes' && !v.visto);
    
    return cumpleMateria && cumpleEstado;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Mis Videos y Clases Grabadas</h1>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-gray-200 px-3 py-2 shadow-sm">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filtroMateria}
              onChange={(e) => setFiltroMateria(e.target.value === 'todas' ? 'todas' : Number(e.target.value))}
              className="bg-transparent text-sm focus:outline-none text-gray-600 font-medium"
            >
              <option value="todas">Todas las materias</option>
              {materias.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-wrap bg-white rounded-lg p-1 border border-gray-200 shadow-sm w-fit">
            <button
              onClick={() => setFiltroEstado('todos')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filtroEstado === 'todos' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltroEstado('pendientes')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filtroEstado === 'pendientes' ? 'bg-amber-100 text-amber-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pendientes
            </button>
            <button
              onClick={() => setFiltroEstado('vistos')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filtroEstado === 'vistos' ? 'bg-green-100 text-green-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Ya Vistos
            </button>
          </div>
        </div>
      </div>

      {videosFiltrados.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center text-gray-500">
          <VideoIcon className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No hay videos</h3>
          <p className="text-sm">No se encontraron videos con los filtros actuales.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videosFiltrados.map((video) => (
            <div key={video.id} className="bg-white rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full group">
              <div 
                className="h-32 p-4 relative flex items-end"
                style={{ backgroundColor: video.materia.color + '20' }}
              >
                <div 
                  className="absolute inset-0 opacity-10"
                  style={{ backgroundColor: video.materia.color }}
                ></div>
                
                <div className="relative z-10 w-full">
                  <span 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm mb-2 shadow-sm"
                    style={{ color: video.materia.color }}
                  >
                    {video.materia.nombre}
                  </span>
                  <h3 className="text-lg font-bold text-gray-900 leading-tight">
                    {video.titulo}
                  </h3>
                </div>
                
                <div className="absolute top-4 right-4">
                  {video.visto ? (
                    <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center shadow-md">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-md animate-pulse">
                      <PlayCircle className="w-5 h-5" />
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-1 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1.5">
                      <VideoIcon className="w-4 h-4" />
                      {video.duracion || 'Sin duración info'}
                    </span>
                    <span className="text-xs">
                      Añadido: {new Date(video.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-100 flex gap-3 mt-auto">
                  <button
                    onClick={() => handleToggleVisto(video.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors border ${
                      video.visto 
                        ? 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                        : 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    {video.visto ? 'Marcar Pendiente' : 'Marcar como Visto'}
                  </button>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center py-2 px-4 rounded-lg bg-primary-600 hover:bg-primary-700 text-white shadow-sm transition-colors group-hover:shadow-md"
                    title="Ver en plataforma externa"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
