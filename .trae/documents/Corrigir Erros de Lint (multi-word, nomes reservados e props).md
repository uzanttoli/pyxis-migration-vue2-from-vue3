## Objetivo
- Eliminar os erros do terminal (especialmente `vue/multi-word-component-names`, `vue/no-reserved-component-names`, `.native` e `v-slot` inválidos) mantendo o servidor estável.

## Estratégia de Nomenclatura
- **Páginas**: usar sufixo `-page` (ex.: `gerencial-page`, `ocupacao-page`).
- **UI/Átomos**: usar prefixo `ui-` (ex.: `ui-title`, `ui-select`, `ui-textarea`, `ui-fieldset`, `ui-section`, `ui-column`).
- **Genéricos/Compostos**: usar sufixo `-component` (ex.: `tabela-component`, `status-component`).

## Ajustes de Componentes (nomes multi-palavra e nomes reservados)
- Renomear `Title` → `ui-title` e **substituir as tags** `<Title>` por `<UiTitle>` nas páginas:
  - `raspadinha/campaign/*`, `raspadinha/campanha.vue`, `tabuladores/tabuladores.vue`, demais referências.
- Renomear `Select` → `ui-select` e **ajustar uso** em `DynamicFormField.vue`:
  - Importar como `UiSelect` e usar tag `<UiSelect>` (substituir `<Select>`).
- Renomear `Textarea` → `ui-textarea` e **ajustar uso** em `DynamicFormField.vue`:
  - Importar como `UiTextarea` e usar `<UiTextarea>`.
- Confirmar e completar mudanças similares já iniciadas: `Fieldset` → `ui-fieldset`, `Section` → `ui-section`, `Column` → `ui-column`, `Table` (DataTable) → `data-table`, `Header` (subcomponente) → `tab-header`.
- Corrigir páginas e componentes restantes com nome de uma palavra: `painel`, `fila`, `ranking`, `index`, `pyxforms`, `solicitante`, `tabulador`, etc., adotando `-page` ou `-component` conforme o caso.

## Props: remover mutações diretas
- Substituir atribuições diretas por proxies computados que emitem `update:<prop>`:
  - `NavigationDrawerRight.component.vue`: props `abrirModal`, `search`.
  - `sisTab.vue`: prop `dialogSisTab`.
  - `smartSales/editar/modalEdit.vue`: prop `dataFields`.
  - `tabuladores/direcionamento/DynamicInput.vue`: prop `modelValue` (usar `v-model` com `emit`).
  - `pyxforms/PyxFormsContent.vue`: prop `formData` (usar `emit` e cópia local reativa).

## v-on .native (deprecado)
- Remover `.native` e ligar eventos corretamente ao componente ou ao wrapper:
  - `shared/components/AlmopeField/AlmopeField.vue`: trocar `@click.native` por evento emitido do componente ou adicionar `div`/`button` nativo para o `click`.

## v-slot modificadores inválidos
- Remover modificadores em `v-slot` e usar `#nome` sem modificadores:
  - Tabelas e cards listados pelo lint (ex.: `gerencialEbilling.vue`, `tableGerencialAbs.vue`, `TableDinamics.vue`, `shortCall60/*`, `linhaMuda/*`).

## Validação
- Rodar `npm run fix` e `npm run lint`.
- Garantir que o terminal não exiba erros (apenas avisos aceitáveis). Se necessário, temporariamente manter algumas regras como `warn` durante a migração e, ao final, restaurar para `error`.

## Entregáveis
- Todos os arquivos com nomes de componentes conformes e sem nomes reservados.
- Remoção de mutações diretas de props com `emit`/`v-model`.
- `v-on` sem `.native` e `v-slot` sem modificadores.
- Lint zerado de erros (avisos mínimos possíveis).