
const formBusca = document.getElementById("form-busca");
const campoPokemon = document.getElementById("campo-pokemon");
const botaoBuscar = document.getElementById("botao-buscar");
const resultado = document.getElementById("resultado");

const API_URL = "https://pokeapi.co/api/v2/pokemon/";

// Busca os dados de um Pokémon na PokéAPI
async function buscarPokemon(nome) {
  const termo = nome.trim().toLowerCase();

  if (!termo) {
    mostrarErro("Digite o nome ou número de um Pokémon.");
    return;
  }

  mostrarCarregando();

  botaoBuscar.disabled = true;
  botaoBuscar.textContent = "Buscando...";

  try {
    const resposta = await fetch(`${API_URL}${termo}`);

    if (!resposta.ok) {
      throw new Error("Pokémon não encontrado");
    }

    const dados = await resposta.json();

    exibirPokemon(dados);
  } catch (erro) {
    mostrarErro("Não encontramos esse Pokémon. Verifique o nome ou número e tente novamente.");
  } finally {
    botaoBuscar.disabled = false;
    botaoBuscar.textContent = "Buscar Pokémon";
  }
}

// Exibe os dados recebidos da API na página
function exibirPokemon(pokemon) {
  const numero = String(pokemon.id).padStart(3, "0");

  const tipos = pokemon.types
    .map(item => `<span class="tipo ${item.type.name}">${item.type.name}</span>`)
    .join("");

  const habilidades = pokemon.abilities
    .map(item => `<span class="habilidade">${item.ability.name.replace("-", " ")}</span>`)
    .join("");

  const altura = (pokemon.height / 10).toFixed(1);
  const peso = (pokemon.weight / 10).toFixed(1);

  resultado.innerHTML = `
    <article class="cartao-pokemon">

      <div class="pokemon-visual">
        <span class="numero-fundo">#${numero}</span>

        <img
          src="${pokemon.sprites.other["official-artwork"].front_default}"
          alt="Imagem do Pokémon ${pokemon.name}"
        >

        <span class="pokemon-nome-visual">${pokemon.name}</span>
      </div>

      <div class="pokemon-detalhes">
        <span class="pokemon-id">POKÉDEX #${numero}</span>
        <h2>${pokemon.name}</h2>

        <div class="tipos">
          ${tipos}
        </div>

        <h3 class="subtitulo">Informações básicas</h3>

        <div class="info-grid">
          <div class="info-item">
            <span class="rotulo">Altura</span>
            <span class="valor">${altura} m</span>
          </div>

          <div class="info-item">
            <span class="rotulo">Peso</span>
            <span class="valor">${peso} kg</span>
          </div>

          <div class="info-item">
            <span class="rotulo">Experiência base</span>
            <span class="valor">${pokemon.base_experience ?? "N/A"}</span>
          </div>

          <div class="info-item">
            <span class="rotulo">Ordem na Pokédex</span>
            <span class="valor">#${pokemon.order}</span>
          </div>
        </div>

        <h3 class="subtitulo">Habilidades</h3>

        <div class="habilidades">
          ${habilidades}
        </div>
      </div>

    </article>
  `;
}

// Mostra a mensagem de carregamento
function mostrarCarregando() {
  resultado.innerHTML = `
    <div class="carregando">
      <div class="spinner"></div>
      <p>Consultando a PokéAPI...</p>
    </div>
  `;
}

// Mostra mensagens de erro
function mostrarErro(mensagem) {
  resultado.innerHTML = `
    <div class="erro">
      <h2>Ops! Algo deu errado.</h2>
      <p>${mensagem}</p>
    </div>
  `;
}

// Evento do formulário de busca
formBusca.addEventListener("submit", function(evento) {
  evento.preventDefault();
  buscarPokemon(campoPokemon.value);
});

// Eventos dos botões de sugestão
document.querySelectorAll(".sugestao").forEach(botao => {
  botao.addEventListener("click", function() {
    const pokemon = this.dataset.pokemon;
    campoPokemon.value = pokemon;
    buscarPokemon(pokemon);
  });
});

// Carrega um Pokémon inicial ao abrir a página
buscarPokemon("pikachu");