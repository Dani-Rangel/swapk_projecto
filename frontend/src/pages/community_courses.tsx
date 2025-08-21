import React, { useState, useRef } from 'react';
import { Search, MessageSquare, Bell, User, Paperclip, X, ChevronLeft, Home, TrendingUp, RefreshCw, BookOpen, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Course {
  id: number;
  title: string;
  description: string;
  objective: string;
  skills: string;
  image: string;
  userAvatar: string;
  userName: string;
  userId: number;
  hashtags: string[];
  isOnline: boolean;
  attachments?: File[];
}

interface NewCourseData {
  title: string;
  description: string;
  objective: string;
  skills: string;
  attachments: File[];
  courseImage: File | null;
}

const CursosComunidad: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showCourseForm, setShowCourseForm] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [newCourse, setNewCourse] = useState<NewCourseData>({
    title: '',
    description: '',
    objective: '',
    skills: '',
    attachments: [],
    courseImage: null
  });
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const currentUserId = 1; // ID del usuario actual

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const handleViewMore = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseForm(false);
    setEditingCourse(null);
  };

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setSelectedCourse(null);
    setShowCourseForm(true);
  };

  const handleCloseForm = () => {
    setShowCourseForm(false);
    setEditingCourse(null);
    setNewCourse({
      title: '',
      description: '',
      objective: '',
      skills: '',
      attachments: [],
      courseImage: null
    });
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setSelectedCourse(null);
    setNewCourse({
      title: course.title,
      description: course.description,
      objective: course.objective,
      skills: course.skills,
      attachments: course.attachments || [],
      courseImage: null
    });
    setShowCourseForm(true);
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedCourses = courses.map(course => {
        if (course.id === editingCourse?.id) {
          const imageUrl = newCourse.courseImage 
            ? URL.createObjectURL(newCourse.courseImage)
            : course.image;

          return {
            ...course,
            title: newCourse.title,
            description: newCourse.description,
            objective: newCourse.objective,
            skills: newCourse.skills,
            image: imageUrl,
            attachments: newCourse.attachments,
            hashtags: newCourse.skills.split(',').map(s => `#${s.trim()}`)
          };
        }
        return course;
      });

      setCourses(updatedCourses);
      setShowCourseForm(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error al actualizar el curso:', error);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const updatedCourses = courses.filter(course => course.id !== courseId);
      setCourses(updatedCourses);
      
      // Cerrar todas las vistas posibles
      setSelectedCourse(null);
      setShowCourseForm(false);
      setEditingCourse(null);
    } catch (error) {
      console.error('Error al eliminar el curso:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewCourse(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setNewCourse(prev => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles]
      }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewCourse(prev => ({
        ...prev,
        courseImage: e.target.files![0]
      }));
    }
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...newCourse.attachments];
    updatedFiles.splice(index, 1);
    setNewCourse(prev => ({
      ...prev,
      attachments: updatedFiles
    }));
  };

  const handleRemoveImage = () => {
    setNewCourse(prev => ({
      ...prev,
      courseImage: null
    }));
  };

  const handleSubmitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const imageUrl = newCourse.courseImage 
        ? URL.createObjectURL(newCourse.courseImage)
        : '/placeholder-course.jpg';

      const addedCourse: Course = {
        id: courses.length + 1,
        title: newCourse.title,
        description: newCourse.description,
        objective: newCourse.objective,
        skills: newCourse.skills,
        image: imageUrl,
        userAvatar: '/placeholder-avatar.jpg',
        userName: 'Tú',
        userId: currentUserId,
        hashtags: newCourse.skills.split(',').map(s => `#${s.trim()}`),
        isOnline: true,
        attachments: newCourse.attachments
      };

      setCourses(prev => [addedCourse, ...prev]);
      handleCloseForm();
    } catch (error) {
      console.error('Error al crear el curso:', error);
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching:', searchQuery);
  };

  

  const CourseDetailView = ({ course }: { course: Course }) => {
    const isCreator = course.userId === currentUserId;

    return (
      <div className={`max-w-4xl mx-auto p-20 rounded-lg shadow-md ${isDark ? 'bg-[#2E2E2E] text-[#F5F5F5]' : 'bg-white text-gray-900'}`}>
        <button 
          className={`flex items-center mb-6 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
          onClick={() => setSelectedCourse(null)}
        >
          <ChevronLeft size={20} className="mr-1" />
          Volver a los cursos
        </button>

        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="relative mr-3">
              <img 
                src={course.userAvatar} 
                alt={course.userName} 
                className="w-10 h-10 rounded-full"
              />
              {course.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <span className={isDark ? "text-[#F5F5F5]" : "text-gray-700"}>{course.userName}</span>
          </div>
          <h1 className={`text-3xl font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-gray-900'}`}>{course.title}</h1>
        </div>

      <div className="space-y-8">
        {course.description && (
          <section>
            <h2 className={`text-xl font-semibold mb-2 w-full ${isDark ? 'text-[#F5F5F5]' : 'text-gray-800'}`}>Descripción</h2>
            <p className={isDark ? "text-[#D1D1D1] w-180 break-words" : "text-gray-600 w-180 break-words"}>{course.description}</p>
          </section>
        )}
        {course.objective && (
          <section>
            <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-[#F5F5F5]' : 'text-gray-800'}`}>Objetivo</h2>
            <p className={isDark ? "text-[#D1D1D1]" : "text-gray-600"}>{course.objective}</p>
          </section>
        )}

        <section>
          <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-[#F5F5F5]' : 'text-gray-800'}`}>Habilidades requeridas</h2>
          <div className="flex items-start">
            <div>
              {course.skills && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {course.skills.split(',').map((skill, index) => (
                    <span 
                      key={index} 
                      className={`px-3 py-1 rounded-full text-sm ${isDark ? 'bg-[#3E3E3E] text-[#F5F5F5]' : 'bg-gray-100 text-gray-800'}`}
                    >
                      #{skill.trim()}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {course.attachments && course.attachments.length > 0 && (
          <section>
            <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-[#F5F5F5]' : 'text-gray-800'}`}>Archivos adjuntos</h2>
            <div className="space-y-2">
              {course.attachments.map((file, index) => (
                <div key={index} className={`flex items-center justify-between p-3 rounded ${isDark ? 'bg-[#3E3E3E]' : 'bg-gray-50'}`}>
                  <div className="flex items-center">
                    <Paperclip size={16} className={`mr-2 ${isDark ? 'text-[#A0A0A0]' : 'text-gray-500'}`} />
                    <span className={isDark ? "text-[#D1D1D1]" : "text-gray-700"}>{file.name}</span>
                  </div>
                  <a 
                    href={URL.createObjectURL(file)} 
                    download={file.name}
                    className={`text-sm px-3 py-1 rounded ${isDark ? 'bg-blue-700 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    Descargar
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className={`text-xl font-semibold mb-2 ${isDark ? 'text-[#F5F5F5]' : 'text-gray-800'}`}>Acciones</h2>
          <div className="flex space-x-4">
            <button className={`px-4 py-2 rounded ${isDark ? 'bg-blue-700 text-white hover:bg-blue-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
              Inscribirse
            </button>
            <button className={`px-4 py-2 rounded ${isDark ? 'bg-[#3E3E3E] text-[#F5F5F5] hover:bg-[#4E4E4E]' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}>
              Enviar mensaje
            </button>
            
            {isCreator && (
              <>
                <button 
                  onClick={() => handleEditCourse(course)}
                  className={`px-4 py-2 rounded ${isDark ? 'bg-yellow-700 text-white hover:bg-yellow-600' : 'bg-yellow-600 text-white hover:bg-yellow-700'}`}
                >
                  Editar curso
                </button>
                <button 
                  onClick={() => handleDeleteCourse(course.id)}
                  className={`px-4 py-2 rounded ${isDark ? 'bg-red-700 text-white hover:bg-red-600' : 'bg-red-600 text-white hover:bg-red-700'}`}
                >
                  {isDeleting ? 'Eliminando...' : 'Eliminar curso'}
                </button>
              </>
            )}
          </div>
        </section>
      </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen flex ${isDark ? "bg-[#1A1A1A]" : "bg-gray-50"}`}>
      {/* Left Sidebar Navigation */}
      <div className={`w-66 flex flex-col border-r transition-colors duration-300 ${isDark ? "bg-[#1E1E1E] border-[#2E2E2E]" : "bg-white border-gray-200"}`}>
        {/* Top Navigation Items */}
        <div className={`p-3 border-b transition-colors duration-300 ${isDark ? "border-[#2E2E2E]" : "border-gray-200"}`}>
          <div className="flex items-center gap-2 mb-3">
            <img 
              src="/img/logoswapk.png" 
              alt="Swapk Logo"
              className="w-7 h-auto"
            />
            <span className={`text-sm transition-colors duration-300 ${isDark ? "text-[#F5F5F5]" : "text-gray-700"}`}>SWAPK</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className={`ml-auto h-6 w-6 p-0 transition-colors duration-300 ${isDark ? "text-[#A0A0A0] hover:bg-[#2E2E2E] hover:text-[#F5F5F5]" : "text-gray-600 hover:text-gray-900"}`}
            >
              {isDark ? <Sun className="w-4 h-4 cursor-pointer" /> : <Moon className="cursor-pointer w-4 h-4" />}
            </Button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-3">
            <Search
              className={`cursor-pointer absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${isDark ? "text-[#A0A0A0]" : "text-gray-500"}`}
            />
            <Input
              placeholder="Buscar en Swapk"
              className={`pl-10 w-full h-8 transition-colors duration-300 
                    border-none shadow-none focus-visible:ring-0 ${
                    isDark 
                        ? "bg-[#1E1E1E] text-[#F5F5F5] placeholder-[#A0A0A0]" 
                        : "bg-gray-100 text-gray-900 placeholder-gray-500"
                    }`} 
            />
          </div>

          {/* User Actions */}
          <div className="flex gap-1 mb-3">
            <Button
              variant="ghost"
              size="sm"
              className={`cursor-pointer flex-1 h-8 transition-colors duration-300 ${isDark ? "text-[#A0A0A0] hover:bg-[#2E2E2E] hover:text-[#F5F5F5]" : "text-gray-600 hover:text-gray-900"}`}
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`cursor-pointer flex-1 h-8 transition-colors duration-300 ${isDark ? "text-[#A0A0A0] hover:bg-[#2E2E2E] hover:text-[#F5F5F5]" : "text-gray-600 hover:text-gray-900"}`}
            >
              <Bell className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`cursor-pointer flex-1 h-8 transition-colors duration-300 ${isDark ? "text-[#A0A0A0] hover:bg-[#2E2E2E] hover:text-[#F5F5F5]" : "text-gray-600 hover:text-gray-900"}`}
            >
              <User className="w-4 h-4" />
            </Button>
          </div>

          {/* Main Navigation */}
          <nav className="space-y-3">
            <Button
              variant="ghost"
              size="sm"
              className="cursor-pointer w-full justify-start bg-blue-600 text-white hover:bg-blue-700 h-8 transition-colors duration-300"
            >
              <Home className="w-4 h-4 mr-2" />
              Inicio
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`cursor-pointer w-full justify-start h-8 transition-colors duration-300 ${isDark ? "text-[#F5F5F5] hover:bg-[#2E2E2E]" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Popular
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`cursor-pointer w-full justify-start h-8 transition-colors duration-300 ${isDark ? "text-[#F5F5F5] hover:bg-[#2E2E2E]" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Intercambios
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`cursor-pointer w-full justify-start h-8 transition-colors duration-300 ${isDark ? "text-[#F5F5F5] hover:bg-[#2E2E2E]" : "text-gray-700 hover:bg-gray-100"}`}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Mis Cursos
            </Button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {selectedCourse ? (
          <div className="p-6">
            <CourseDetailView course={selectedCourse} />
          </div>
        ) : showCourseForm ? (
        <div className="p-6">
          <div className={`max-w-2xl mx-auto p-6 rounded-lg shadow-md ${isDark ? 'bg-[#2E2E2E]' : 'bg-white'}`}>
            <div className="relative mb-6">
              <h2 className={`text-2xl font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-gray-900'}`}>
                {editingCourse ? 'Editar curso' : 'Genial, hagámoslo'}
              </h2>
              <h3 className={isDark ? 'text-[#D1D1D1]' : 'text-gray-600'}>
                {editingCourse ? 'Modifica los detalles de tu curso' : 'Cuéntanos, ¿De qué trata tu curso?'}
              </h3>
              <button 
                className={`absolute top-0 right-0 ${isDark ? 'text-[#A0A0A0] hover:text-[#F5F5F5]' : 'text-gray-500 hover:text-gray-700'} disabled:opacity-50`}
                onClick={handleCloseForm}
                disabled={formSubmitting}
              >
                ×
              </button>
            </div>
              
               <form onSubmit={editingCourse ? handleUpdateCourse : handleSubmitCourse} className="space-y-6">
                {/* Campo para la imagen del curso */}
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#D1D1D1]' : 'text-gray-700'}`}>
                    Imagen del curso
                  </label>
                  <div className="space-y-3">
                    <button 
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className={`flex items-center px-4 py-2 rounded-md ${isDark ? 'bg-[#3E3E3E] text-[#F5F5F5] hover:bg-[#4E4E4E]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      <Paperclip size={16} className="mr-2" />
                      {newCourse.courseImage ? 'Cambiar imagen' : 'Seleccionar imagen'}
                    </button>
                    <input
                      type="file"
                      ref={imageInputRef}
                      onChange={handleImageChange}
                      className="hidden"
                      accept="image/*"
                    />
                    
                    {newCourse.courseImage && (
                      <div className="mt-2">
                        <div className="flex justify-between items-center mb-2">
                          <p className={`text-sm ${isDark ? 'text-[#D1D1D1]' : 'text-gray-700'}`}>
                            Vista previa:
                          </p>
                          <button 
                            type="button"
                            onClick={handleRemoveImage}
                            className={`text-sm ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-500'}`}
                          >
                            Eliminar
                          </button>
                        </div>
                        <div className="relative h-40 rounded-md overflow-hidden border">
                          <img
                            src={URL.createObjectURL(newCourse.courseImage)}
                            alt="Vista previa del curso"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="title" className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#D1D1D1]' : 'text-gray-700'}`}>
                    Título del curso
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newCourse.title}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-md ${isDark ? 'bg-[#3E3E3E] border-[#4E4E4E] text-[#F5F5F5]' : 'bg-white border-gray-300 text-gray-900'}`}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#D1D1D1]' : 'text-gray-700'}`}>
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newCourse.description}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-md ${isDark ? 'bg-[#3E3E3E] border-[#4E4E4E] text-[#F5F5F5]' : 'bg-white border-gray-300 text-gray-900'}`}
                    required
                    rows={4}
                  />
                </div>
                
                <div>
                  <label htmlFor="objective" className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#D1D1D1]' : 'text-gray-700'}`}>
                    Objetivo principal
                  </label>
                  <input
                    type="text"
                    id="objective"
                    name="objective"
                    value={newCourse.objective}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-2 border rounded-md ${isDark ? 'bg-[#3E3E3E] border-[#4E4E4E] text-[#F5F5F5]' : 'bg-white border-gray-300 text-gray-900'}`}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="skills" className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#D1D1D1]' : 'text-gray-700'}`}>
                    Habilidades requeridas (separadas por comas)
                  </label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={newCourse.skills}
                    onChange={handleFormChange}
                    placeholder="Ej: HTML, CSS, JavaScript"
                    className={`w-full px-3 py-2 border rounded-md ${isDark ? 'bg-[#3E3E3E] border-[#4E4E4E] text-[#F5F5F5]' : 'bg-white border-gray-300 text-gray-900'}`}
                    required
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium mb-1 ${isDark ? 'text-[#D1D1D1]' : 'text-gray-700'}`}>
                    Archivos adjuntos
                  </label>
                  <div className="space-y-3">
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={`flex items-center px-4 py-2 rounded-md ${isDark ? 'bg-[#3E3E3E] text-[#F5F5F5] hover:bg-[#4E4E4E]' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      <Paperclip size={16} className="mr-2" />
                      Adjuntar archivos
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      multiple
                    />
                    
                    {newCourse.attachments.length > 0 && (
                      <div className="space-y-2">
                        {newCourse.attachments.map((file, index) => (
                          <div key={index} className={`flex items-center justify-between p-2 rounded ${isDark ? 'bg-[#3E3E3E]' : 'bg-gray-50'}`}>
                            <span className={`text-sm ${isDark ? 'text-[#D1D1D1]' : 'text-gray-700'}`}>
                              {file.name} ({Math.round(file.size / 1024)} KB)
                            </span>
                            <button 
                              type="button"
                              onClick={() => handleRemoveFile(index)}
                              className={isDark ? "text-[#A0A0A0] hover:text-[#F5F5F5]" : "text-gray-500 hover:text-red-500"}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                               <div className="flex justify-end space-x-3 pt-4">
                {editingCourse && (
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('¿Estás seguro de que deseas eliminar este curso?')) {
                        handleDeleteCourse(editingCourse.id);
                      }
                    }}
                    disabled={formSubmitting || isDeleting}
                    className={`px-4 py-2 rounded-md text-white ${isDark ? 'bg-red-700 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'} disabled:opacity-50`}
                  >
                    {isDeleting ? 'Eliminando...' : 'Eliminar curso'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleCloseForm}
                  disabled={formSubmitting || isDeleting}
                  className={`px-4 py-2 border rounded-md ${isDark ? 'border-[#4E4E4E] text-[#F5F5F5] hover:bg-[#3E3E3E]' : 'border-gray-300 text-gray-700 hover:bg-gray-50'} disabled:opacity-50`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting || isDeleting}
                  className={`px-4 py-2 rounded-md text-white ${isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50`}
                >
                  {formSubmitting ? (editingCourse ? 'Actualizando...' : 'Publicando...') : (editingCourse ? 'Actualizar curso' : 'Publicar curso')}
                </button>
              </div>
            </form>
          </div>
        </div>
       ) : selectedCourse ? (
        <div className="p-6">
          <CourseDetailView course={selectedCourse} />
        </div>
      ) : (
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <h1 className={`text-2xl font-bold ${isDark ? 'text-[#F5F5F5]' : 'text-gray-900'}`}>Cursos de la comunidad</h1>
              <button 
                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDark ? 'focus:ring-blue-500' : 'focus:ring-blue-500'}`}
                onClick={handleCreateCourse}
              >
                Crear curso
              </button>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.length > 0 ? (
                courses.map((course) => (
                  <div key={course.id} className={`overflow-hidden shadow rounded-lg ${isDark ? 'bg-[#2E2E2E]' : 'bg-white'}`}>
                    <div className="relative pb-48 overflow-hidden">
                      <img
                        className="absolute inset-0 h-full w-full object-cover"
                        src={course.image}
                        alt={course.title}
                      />
                      <div className="absolute bottom-4 left-4">
                        <div className="relative">
                          <img
                            className="h-10 w-10 rounded-full border-2 border-white"
                            src={course.userAvatar}
                            alt={course.userName}
                          />
                          {course.isOnline && (
                            <div className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white"></div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex items-center mb-2">
                        <span className={`text-sm ${isDark ? 'text-[#D1D1D1]' : 'text-gray-600'}`}>{course.userName}</span>
                      </div>
                      <h3 className={`text-lg font-medium mb-1 ${isDark ? 'text-[#F5F5F5]' : 'text-gray-900'}`}>{course.title}</h3>
                      <p className={`text-sm mb-1 ${isDark ? 'text-[#A0A0A0]' : 'text-gray-500'}`}>{course.objective}</p>
                      <p className={`text-sm mb-1 ${isDark ? 'text-[#A0A0A0] w-120 h-full break-words'  : 'text-gray-500 w-80 h-full break-words'}`}>{course.description}</p>
                      
                      
                      <div className="flex flex-wrap gap-1 mb-4">
                        {course.hashtags.map((hashtag, index) => (
                          <span 
                            key={index} 
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isDark ? 'bg-[#3E3E3E] text-[#F5F5F5]' : 'bg-blue-100 text-blue-800'}`}
                          >
                            {hashtag}
                          </span>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => handleViewMore(course)}
                        className={`w-full inline-flex justify-center items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md ${isDark ? 'border-[#4E4E4E] text-[#F5F5F5] bg-[#3E3E3E] hover:bg-[#4E4E4E]' : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDark ? 'focus:ring-blue-500' : 'focus:ring-blue-500'}`}
                      >
                        Ver más
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`text-center py-16 px-6 shadow rounded-lg col-span-full ${isDark ? 'bg-[#2E2E2E]' : 'bg-white'}`}>
                  <p className={isDark ? 'text-[#D1D1D1] mb-6' : 'text-gray-600 mb-6'}>No hay cursos disponibles todavía.</p>
                  <button 
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDark ? 'focus:ring-blue-500' : 'focus:ring-blue-500'}`}
                    onClick={handleCreateCourse}
                  >
                    Sé el primero en crear un curso
                  </button>
                </div>
              )}
            </div>

            {/* Call to Action Section */}
            {courses.length > 0 && (
              <div className={`mt-12 shadow rounded-lg overflow-hidden ${isDark ? 'bg-[#2E2E2E]' : 'bg-white'}`}>
                <div className="px-6 py-12 sm:px-12 flex flex-col sm:flex-row justify-between items-center">
                  <div className="mb-6 sm:mb-0">
                    <h2 className={`text-2xl font-bold mb-2 ${isDark ? 'text-[#F5F5F5]' : 'text-gray-900'}`}>¿Muy interesante no?</h2>
                    <p className={isDark ? 'text-[#D1D1D1]' : 'text-gray-600'}>¿Acaso quieres compartir cursos con los demás?</p>
                  </div>
                  <button
                    className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${isDark ? 'bg-blue-700 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDark ? 'focus:ring-blue-500' : 'focus:ring-blue-500'}`}
                    onClick={handleCreateCourse}
                  >
                    Crear curso
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CursosComunidad;