import getDatos from "./getDatos.js";

const params = new URLSearchParams(window.location.search);
const serieId = params.get('id');
const listaTemporadas = document.getElementById('temporadas-select');
const fichaSerie = document.getElementById('temporadas-episodios');
const fichaDescripcion = document.getElementById('ficha-descripcion');

// Funcion para cargar temporadas
function cargarTemporadas() {
    getDatos(`/series/${serieId}/temporadas/todas`)
        .then(data => {
            const temporadasUnicas = [...new Set(data.map(temporada => temporada.temporada))];
            listaTemporadas.innerHTML = ''; // Limpia las opciones existentes

            const optionDefault = document.createElement('option');
            optionDefault.value = '';
            optionDefault.textContent = 'Seleccione la temporada'
            listaTemporadas.appendChild(optionDefault); 
           
            temporadasUnicas.forEach(temporada => {
                const option = document.createElement('option');
                option.value = temporada;
                option.textContent = temporada;
                listaTemporadas.appendChild(option);
            });

            const optionTodos = document.createElement('option');
            optionTodos.value = 'todas';
            optionTodos.textContent = 'Todas las temporadas'
            listaTemporadas.appendChild(optionTodos); 

            // Opción para el Top 5 episodios
            const optionTop5 = document.createElement('option');
            optionTop5.value = 'top5';
            optionTop5.textContent = 'Top 5 episodios';
            listaTemporadas.appendChild(optionTop5);
        })
        .catch(error => {
            console.error('Error al obtener temporadas:', error);
        });
}

// Funcion para cargar episodios de una temporada
function cargarEpisodios() {

    const seleccion = listaTemporadas.value;

    if (seleccion === 'top5') {
        // Si se selecciona "Top 5 episodios", hacer la solicitud a la API correspondiente
        getDatos(`/series/${serieId}/temporadas/top`)
            .then(data => {
                fichaSerie.innerHTML = '';  // Limpiar la ficha de episodios

                // Crear lista de episodios Top 5
                const ul = document.createElement('ul');
                ul.className = 'episodios-lista';
                const listaHTML = data.map(episodio => `
                    <li>
                        ${episodio.numeroEpisodio} - ${episodio.titulo}
                    </li>
                `).join('');
                ul.innerHTML = listaHTML;
                fichaSerie.appendChild(ul);
            })
            .catch(error => {
                console.error('Error al obtener los Top 5 episodios:', error);
            });
    } else {

    getDatos(`/series/${serieId}/temporadas/${listaTemporadas.value}`)
        .then(data => {
            const temporadasUnicas = [...new Set(data.map(temporada => temporada.temporada))];
            fichaSerie.innerHTML = ''; 
            temporadasUnicas.forEach(temporada => {
                const ul = document.createElement('ul');
                ul.className = 'episodios-lista';

                const episodiosTemporadaAtual = data.filter(serie => serie.temporada === temporada);

                const listaHTML = episodiosTemporadaAtual.map(serie => `
                    <li>
                        ${serie.numeroEpisodio} - ${serie.titulo}
                    </li>
                `).join('');
                ul.innerHTML = listaHTML;
                
                const paragrafo = document.createElement('p');
                const linha = document.createElement('br');
                paragrafo.textContent = `Temporada ${temporada}`;
                fichaSerie.appendChild(paragrafo);
                fichaSerie.appendChild(linha);
                fichaSerie.appendChild(ul);
            });
        })
        .catch(error => {
            console.error('Error al obtener episodios:', error);
        });
    }
}

// Funcion para cargar informaciones de la serie
function cargarInfoSerie() {
    getDatos(`/series/${serieId}`)
        .then(data => {
            fichaDescripcion.innerHTML = `
                <img src="${data.poster}" alt="${data.titulo}" />
                <div>
                    <h2>${data.titulo}</h2>
                    <div class="descricao-texto">
                        <p><b>Média de evaluaciones:</b> ${data.evaluacion}</p>
                        <p>${data.sinopsis}</p>
                        <p><b>Actores:</b> ${data.actores}</p>
                    </div>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error al obtener informaciones de la serie:', error);
        });
}

// Adiciona escuchador de evento para el elemento select
listaTemporadas.addEventListener('change', cargarEpisodios);

// Carga las informaciones de la série y las temporadas cuando la página carga
cargarInfoSerie();
cargarTemporadas();
