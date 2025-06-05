import React, { useState, useEffect, useCallback } from 'react';

// Componente principal da aplicação
function App() {
  const [videoSource, setVideoSource] = useState(''); // Estado para a URL do vídeo a ser exibido
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar o carregamento

  // URLs de exemplo para o MVP
  const patreonDomain = 'https://www.patreon.com'; // Domínio do Patreon (para simulação de Referer)
  const actualVideoUrl = 'https://www.w3schools.com/html/mov_bbb.mp4'; // URL de um vídeo de exemplo (substitua pelos seus do Gdrive/Mega/etc.)
  const institutionalVideoUrl = 'https://www.w3schools.com/html/movie.mp4'; // URL de vídeo institucional de exemplo

  // Função para simular a validação do referer no backend
  // Na produção, esta lógica estaria em um servidor que retornaria a URL do vídeo.
  const simulateBackendValidation = useCallback(async () => {
    setIsLoading(true);
    // Simula a verificação do cabeçalho 'Referer' que viria do navegador.
    // Em um ambiente de produção, você enviaria uma requisição para o seu backend
    // e o backend verificaria o 'Referer' lá, retornando a URL apropriada.
    const referer = document.referrer; // Obtém o referer atual do navegador
    console.log('Referer detectado:', referer);

    if (referer.startsWith(patreonDomain)) {
      // Se o referer for do Patreon, define o vídeo real
      setVideoSource(actualVideoUrl);
      console.log('Acesso válido: Carregando vídeo principal.');
    } else {
      // Caso contrário, define o vídeo institucional
      setVideoSource(institutionalVideoUrl);
      console.log('Acesso inválido: Carregando vídeo institucional.');
    }
    setIsLoading(false);
  }, [patreonDomain, actualVideoUrl, institutionalVideoUrl]);

  // Funções de manipulação de eventos para bloqueio, movidas para fora do useEffect
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleCopyCut = useCallback((e) => {
    e.preventDefault();
    // Opcional: Mostrar uma mensagem ao usuário
    // alert('Cópia de conteúdo não permitida.'); // Não usar alert(), substituir por um modal customizado em apps reais
    console.log('Tentativa de cópia/recorte bloqueada.');
  }, []);

  // Efeitos para carregar o vídeo e configurar as proteções ao montar o componente
  useEffect(() => {
    simulateBackendValidation();

    // Adiciona os event listeners globais
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyCut);
    document.addEventListener('cut', handleCopyCut);

    // Limpeza dos event listeners ao desmontar o componente
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyCut);
      document.removeEventListener('cut', handleCopyCut);
    };
  }, [simulateBackendValidation, handleContextMenu, handleCopyCut]); // Adicionado dependências para useCallback

  // Função para lidar com erros no vídeo (ex: URL inválida)
  const handleVideoError = () => {
    console.error("Erro ao carregar o vídeo.");
    // Pode-se exibir uma mensagem de erro na UI aqui.
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 font-inter">
      <div className="bg-gray-800 rounded-lg shadow-2xl p-6 w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-400">
          Bem-vindo ao Conteúdo Exclusivo!
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <p className="ml-4 text-lg">Carregando conteúdo...</p>
          </div>
        ) : (
          <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg mb-6">
            {videoSource ? (
              <video
                controls
                autoPlay
                className="absolute top-0 left-0 w-full h-full object-contain bg-black"
                onContextMenu={handleContextMenu} // Garante que o clique direito seja bloqueado no vídeo
                onCopy={handleCopyCut}
                onCut={handleCopyCut}
                onError={handleVideoError}
              >
                <source src={videoSource} type="video/mp4" />
                Seu navegador não suporta a tag de vídeo.
              </video>
            ) : (
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-red-800 text-white text-xl rounded-lg">
                <p>Não foi possível carregar o vídeo.</p>
              </div>
            )}
          </div>
        )}

        <p className="text-center text-sm text-gray-400 mt-4">
          Este conteúdo é exclusivo para apoiadores do Patreon.
          Acesso liberado apenas via link direto do Patreon.
        </p>
        <p className="text-center text-xs text-gray-500 mt-2">
          Qualquer tentativa de download ou cópia é bloqueada.
        </p>
      </div>
    </div>
  );
}

export default App;
