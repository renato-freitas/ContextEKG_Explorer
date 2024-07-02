![image](src/commons/logo-context-ekg-explorer.png) 
# ContextEKG_Explorer
### _A Tool for Context-Based Exploration of the Semantic View of Enterprise Knowledge Graphs_

ContextEKG_Explorer é uma aplicação web, desenvolvida com a biblioteca [React](https://breakdance.github.io/breakdance/), que renderiza as triplas dos grafos como componentes HTML. 
O diferencial dessa ferramenta é permitir que os usuários explorem entidades em múltiplos contextos, oferecendo diversas perspectivas sobre elas.
Suas principais _features_ incluem: 

- facilita a descoberta de contexto;
- aplicável em qualquer domínio do conhecimento;
- usa consultas SPARQL otimizadas, ideais para explorar grafos em larga escala;
- permite alternar a linguagem de preferência entre português e inglês.  Os rótulos da ferramenta são apresentados conforme a linguagem selecionada e as consultas SPARQL recebem tal linguagem como parâmetro aplicando um filtro para recuperar termos anotados com a respectiva linguagem. 

# Arquitetura

# Data Design Pattern

# Demonstração
Vídeo de demonstração da ferramenta no [Youtube](https://www.youtube.com/watch?v=LrPs3Hh-WfI)

# Vocabulário
Para renderizar as triplas, a ContextEKG_Explorer espera alguns termos.

Para as _timelines_, por exemplo, o grafo deve ser derivado da ontologia de timelines:

<img src="src/img/ontologia-timeline.png" alt="Description" width="400" height="300">

A ontologia da visão semântica:

As classes das visões exportadas devem ter a propriedade ``vskg:belongsToESV'' com rdfs:range xds:string, cujo valor deve ser exatamente o mesmo nome da fonte de dados. Um exemplo em Turtle:

```sparql
svm:MusicalArtist rdf:type owl:Class.
svm:MusicalArtist vskg:belongsToESV "Wikidata"
```




# Restrições 
Para um grafo ser explorado na ferramenta ContextEKG_Explorer ele deve se construído com o nosso DDP e observar algumas restrições:
- Na nossa abordagem, os recursos dos grafos de conhecimento são construídos, mandatoriamente, com as propriedades dc:identifier e rdfs:label. O dc:identifier é para um controle interno e o rdfs:label.

- Não foi testada com BlankNodes.



