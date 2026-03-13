import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, FileText, Link as LinkIcon, StickyNote, Download, CheckCircle2, PenTool } from 'lucide-react';
import { Tldraw, useEditor } from '@tldraw/tldraw';
import '@tldraw/tldraw/tldraw.css';
import { apuntesAPI, materiasAPI } from '../api';
import { Apunte, Materia } from '../types';
import Modal from '../components/Modal';

const TIPOS = [
  { value: 'nota', label: 'Nota', icon: StickyNote },
  { value: 'link', label: 'Link', icon: LinkIcon },
  { value: 'archivo', label: 'Archivo', icon: FileText },
  { value: 'canvas', label: 'Pizarrón', icon: PenTool },
] as const;

function CustomTldraw({ apunte, onClose }: { apunte: Apunte; onClose: () => void }) {
  const editor = useEditor();
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!editor) return;
    setSaving(true);
    const snapshot = editor.store.getStoreSnapshot();
    await apuntesAPI.update(apunte.id, { canvasData: JSON.stringify(snapshot) } as any);
    setSaving(false);
    onClose();
  };

  return (
    <div className="absolute bottom-4 right-4 z-50">
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 shadow-lg transition-transform hover:scale-105 disabled:opacity-50"
      >
        {saving ? (
          <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" /> Guardando...</>
        ) : (
          <><CheckCircle2 className="w-4 h-4" /> Guardar Pizarrón</>
        )}
      </button>
    </div>
  );
}

export default function Apuntes() {
  const [apuntes, setApuntes] = useState<Apunte[]>([]);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [editando, setEditando] = useState<Apunte | null>(null);
  const [viewing, setViewing] = useState<Apunte | null>(null);
  const [filtroMateria, setFiltroMateria] = useState<number | ''>('');
  const [busqueda, setBusqueda] = useState('');
  const [form, setForm] = useState({ materiaId: 0, titulo: '', contenido: '', tipo: 'nota' as string, url: '' });
  const [downloading, setDownloading] = useState<number | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<number | null>(null);

  const fetchData = async () => {
    const [a, m] = await Promise.all([
      apuntesAPI.getAll({ materiaId: filtroMateria ? Number(filtroMateria) : undefined, busqueda: busqueda || undefined }),
      materiasAPI.getAll(),
    ]);
    setApuntes(a); setMaterias(m); setLoading(false);
  };

  useEffect(() => { const t = setTimeout(fetchData, busqueda ? 300 : 0); return () => clearTimeout(t); }, [filtroMateria, busqueda]);

  const resetForm = () => { setForm({ materiaId: materias[0]?.id || 0, titulo: '', contenido: '', tipo: 'nota', url: '' }); setEditando(null); };

  const openCreate = () => { resetForm(); setForm(f => ({ ...f, materiaId: materias[0]?.id || 0 })); setModalOpen(true); };

  const openEdit = (a: Apunte) => { setEditando(a); setForm({ materiaId: a.materiaId, titulo: a.titulo, contenido: a.contenido || '', tipo: a.tipo, url: a.url || '' }); setModalOpen(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { ...form };
    // Mismo body pero manejado via API
    if (editando) await apuntesAPI.update(editando.id, payload);
    else await apuntesAPI.create(payload);
    setModalOpen(false); fetchData();
  };

  const handleDelete = async (id: number) => { if (!confirm('¿Eliminar?')) return; await apuntesAPI.delete(id); fetchData(); };

  const handleDownload = (apunte: Apunte) => {
    setDownloading(apunte.id);
    // Simular descarga de 1.5s
    setTimeout(() => {
      setDownloading(null);
      setDownloadSuccess(apunte.id);
      setTimeout(() => setDownloadSuccess(null), 3000);
    }, 1500);
  };

  function renderMd(t: string) { return t.replace(/^### (.+)$/gm,'<h3>$1</h3>').replace(/^## (.+)$/gm,'<h2>$1</h2>').replace(/^# (.+)$/gm,'<h1>$1</h1>').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\*(.+?)\*/g,'<em>$1</em>').replace(/`(.+?)`/g,'<code>$1</code>').replace(/^\- (.+)$/gm,'<li>$1</li>').replace(/\n/g,'<br/>'); }

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="text-gray-500">{apuntes.length} apuntes</p>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl font-medium text-sm hover:bg-primary-700 shadow-sm"><Plus className="w-4 h-4" /> Nuevo Apunte</button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)} placeholder="Buscar apuntes..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" />
        </div>
        <select value={filtroMateria} onChange={e => setFiltroMateria(e.target.value ? parseInt(e.target.value) : '')} className="px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500">
          <option value="">Todas las materias</option>
          {materias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apuntes.map(apunte => {
          const Icon = apunte.tipo === 'link' ? LinkIcon : apunte.tipo === 'archivo' ? FileText : apunte.tipo === 'canvas' ? PenTool : StickyNote;
          return (
            <div key={apunte.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => { setViewing(apunte); setViewOpen(true); }}>
              <div className="h-1" style={{ backgroundColor: apunte.materia.color }} />
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2"><Icon className="w-4 h-4 text-gray-400" /><span className="text-xs text-gray-400 uppercase">{apunte.tipo}</span></div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <button onClick={() => openEdit(apunte)} className="p-1 text-gray-400 hover:text-primary-600 rounded"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(apunte.id)} className="p-1 text-gray-400 hover:text-red-600 rounded"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <h3 className="font-bold text-gray-900 mb-1 truncate">{apunte.titulo}</h3>
                <p className="text-xs text-gray-500 mb-2">{apunte.materia.nombre}</p>
                {apunte.contenido && <p className="text-xs text-gray-400 line-clamp-3">{apunte.contenido.slice(0, 150)}</p>}
                {apunte.url && <a href={apunte.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline mt-2 block truncate" onClick={e => e.stopPropagation()}>🔗 {apunte.url}</a>}
              </div>
            </div>
          );
        })}
      </div>

      {apuntes.length === 0 && <div className="text-center py-12 text-gray-400"><StickyNote className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No se encontraron apuntes</p></div>}

      <Modal isOpen={viewOpen} onClose={() => setViewOpen(false)} title={viewing?.titulo || ''} size="lg">
        {viewing && <div>
          <div className="flex items-center gap-2 mb-4"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: viewing.materia.color }} /><span className="text-sm text-gray-500">{viewing.materia.nombre}</span></div>
          
          {viewing.tipo === 'archivo' && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">Documento Adjunto</h4>
                  <p className="text-xs text-gray-500">Haz clic para descargar a tu dispositivo</p>
                </div>
              </div>
              <button
                onClick={() => handleDownload(viewing)}
                disabled={downloading === viewing.id || downloadSuccess === viewing.id}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  downloadSuccess === viewing.id
                    ? 'bg-green-100 text-green-700'
                    : downloading === viewing.id
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm'
                }`}
              >
                {downloadSuccess === viewing.id ? (
                  <><CheckCircle2 className="w-4 h-4" /> ¡Descargado!</>
                ) : downloading === viewing.id ? (
                  <><div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" /> Descargando...</>
                ) : (
                  <><Download className="w-4 h-4" /> Descargar Material</>
                )}
              </button>
            </div>
          )}

          {viewing.url && viewing.tipo !== 'archivo' && viewing.tipo !== 'canvas' && <a href={viewing.url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary-600 hover:underline mb-4 block">🔗 {viewing.url}</a>}
          {viewing.tipo === 'nota' && viewing.contenido && <div className="markdown-content prose max-w-none" dangerouslySetInnerHTML={{ __html: renderMd(viewing.contenido) }} />}
          {viewing.tipo === 'canvas' && (
            <div className="w-full h-[600px] border border-gray-200 rounded-xl overflow-hidden shadow-inner relative z-0">
              <Tldraw autoFocus={false} persistenceKey={`tldraw-materia-${viewing.materiaId}-apunte-${viewing.id}`}>
                <CustomTldraw apunte={viewing} onClose={() => setViewOpen(false)} />
              </Tldraw>
            </div>
          )}
        </div>}
      </Modal>

      <Modal isOpen={modalOpen} onClose={() => { setModalOpen(false); resetForm(); }} title={editando ? 'Editar Apunte' : 'Nuevo Apunte'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Título</label><input type="text" required value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Materia</label><select value={form.materiaId} onChange={e => setForm({ ...form, materiaId: parseInt(e.target.value) })} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500">{materias.map(m => <option key={m.id} value={m.id}>{m.nombre}</option>)}</select></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
            <div className="flex gap-2">{TIPOS.map(t => { const I = t.icon; return <button key={t.value} type="button" onClick={() => setForm({ ...form, tipo: t.value })} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${form.tipo === t.value ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-300' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}><I className="w-4 h-4" /> {t.label}</button>; })}</div>
          </div>
          {(form.tipo === 'link' || form.tipo === 'archivo') && <div><label className="block text-sm font-medium text-gray-700 mb-1">URL</label><input type="url" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500" /></div>}
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Contenido <span className="text-gray-400">(Markdown)</span></label><textarea value={form.contenido} onChange={e => setForm({ ...form, contenido: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 resize-none font-mono" rows={8} placeholder="# Título&#10;Escribí tus notas aquí..." /></div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => { setModalOpen(false); resetForm(); }} className="px-4 py-2 text-sm text-gray-600 font-medium rounded-xl hover:bg-gray-100">Cancelar</button>
            <button type="submit" className="px-5 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 shadow-sm">{editando ? 'Guardar' : 'Crear'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
