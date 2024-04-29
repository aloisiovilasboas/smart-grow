<template>
  <div class="flex flex-column " style="min-width: 700px;">
    <TabView>
      <TabPanel header="Lotes">
        <div class="grid grid-cols-2">
          <div class="flex flex-column ">
            <Button label="Novo Lote" icon="pi pi-plus" class="mr-2" @click="openNewLote" />
          </div>
          <div class="flex flex-column ">
            <Button label="Novo Bloco" icon="pi pi-plus" class="mr-2" @click="insertBloco" />
          </div>
        </div>

        <div>
          <Dialog v-model:visible="insertblocodialog" :style="{ width: '70%' }" header="Inserir Bloco" :modal="true"
            class="p-fluid">

            <div class="field">
              <label for="nome">Nome do bloco</label>
              <Dropdown v-model="insertblocododialog.bloco" :options="blocosStore.blocos" optionLabel="nome" checkmark
                :highlightOnSelect="false" />
              <small class="p-error" v-if="submitted && !insertblocododialog.bloco">Esse campo não pode ficar em
                branco</small>
            </div>

            <div v-if="insertblocododialog.bloco">
              <Card class="cardPlantio">
                <template #content>
                  <div v-for="plantio in insertblocododialog.bloco.plantios" :key="plantio.id">
                    <span style="padding: 1em">{{ plantio.dia }} </span>
                    <span style="padding: 1em">{{ plantio.especSemente.microverde }} </span>

                    <span style="padding: 1em">{{ plantio.numBandejas + ' bandejas' }} </span>
                  </div>
                </template>
              </Card>

            </div>

            <div class="field">
              <label for="data">Semana de colheita</label>
              <Calendar id="data" v-model="insertblocododialog.dataColheita" required="true"
                :invalid="submitted && !insertblocododialog.dataColheita" />
              <small class="p-error" v-if="submitted && !insertblocododialog.dataColheita">Esse campo não pode ficar em
                branco</small>
            </div>

            <template #footer>
              <Button label="Cancelar" icon="pi pi-times" text @click="hideInsertBlocoDialog" />
              <Button label="Salvar" icon="pi pi-check" text @click="salvarInsertBloco" />
            </template>


          </Dialog>

        </div>



        <!--  <div class="flex flex-column ">
          <Button label="Novo Lote" icon="pi pi-plus" class="mr-2" @click="openNewLote" />
        </div>
        <span style="padding: 1em;"> </span>
        <div class="flex flex-column ">
          <Button label="Incluir Bloco" icon="pi pi-plus" class="mr-2" @click="openNewLote" />
        </div> -->
        <div style="padding-top: 1rem;">
          <label for="mescol">Mês: </label>
          <Calendar v-model="mes" view="month" id="mescol" dateFormat="mm/yy" />
        </div>
        <div>
          <div>
            <TabView v-if="temPlantioNoMes" class="flex flex-column">
              <TabPanel v-for="semana in meses[numeroMes].semanas" :key="semana.domingo" :header="semana.titulo">
                <div class="flex flex-row flex-wrap">
                  <div v-for="(data, index) in datasSemana" class="flex flex-column" style="width: 14.28%">
                    <div>
                      <!-- date.setDate(date.getDate() + 1); -->
                      <span class="word-data">
                        {{ new Date(semana.domingoDate.getTime() + (24 * 60 * 60 * 1000) * index).toLocaleDateString()
                        }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="flex flex-row flex-wrap">
                  <div v-for="dia in dias" :key="dia.dia" class="flex flex-column" style="width: 14.28%">
                    <div>
                      <span class="word-acao">
                        {{ dia.dia }}
                      </span>
                    </div>
                  </div>
                </div>
                <Divider> </Divider>
                <div class="flex flex-row flex-wrap">
                  <div v-for="(dia, index) in dias" :key="dia.dia" class="flex flex-column" style="width: 14.28%">
                    <div v-for="acao in meses[numeroMes][semana.domingo].dias[index]" :key="acao.data"
                      style="padding: 0.5rem;">
                      <div class="cardTarefas" :style="{ 'background-color': achaBG(acao.acao) }">
                        <span class="word-large">{{ acao.plantio }}</span>
                        <span class="word-small">{{ acao.lote }}</span>
                        <span class="word-acao">{{ acao.acao }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </TabView>
          </div>
        </div>
        <div>
          <Dialog v-model:visible="loteDialog" :style="{ width: '70%' }" header="Novo Lote" :modal="true"
            class="p-fluid">

            <div class="field">
              <label for="nome">Nome do lote</label>
              <InputText id="nome" v-model.trim="lotedodialog.nome" required="true" autofocus
                :invalid="submitted && !lotedodialog.nome" />
              <small class="p-error" v-if="submitted && !lotedodialog.nome">Esse campo não pode ficar em
                branco</small>
            </div>
            <Card v-for="plantio in plantiosdoDialog" class="cardPlantio">
              <template #header>
                <div class="p-d-flex p-jc-between ">

                  <Button icon="pi pi-times" class="p-button-rounded  p-button-contrast" @click="removeplantio(plantio)"
                    aria-label="Filter" />
                </div>
              </template>
              <template #content>
                <div class="flex flex-row flex-wrap">
                  <!-- duas colulas -->
                  <div class="flex flex-column">
                    <div class="field">
                      <label for="microverde">Microverde</label>
                      <Dropdown v-model="plantio.semente" :options="sementesStore.sementes" optionLabel="microverde"
                        placeholder="Microverde" checkmark :highlightOnSelect="false" />
                      <small class="p-error" v-if="submitted && !plantio.semente">Esse campo não pode ficar em
                        branco</small>
                    </div>
                    <div class="field">
                      <label for="data">Data da colheita</label>
                      <Calendar id="data" v-model="plantio.dataColheita" required="true"
                        :invalid="submitted && !plantio.data" />
                      <small class="p-error" v-if="submitted && !plantio.dataColheita">Esse campo não pode ficar em
                        branco</small>
                    </div>
                    <div class="field">
                      <label for="data">Número de bandejas</label>
                      <InputNumber id="bandejas" v-model="plantio.numBandejas" required="true"
                        :invalid="submitted && !plantio.numBandejas" />

                      <small class="p-error" v-if="submitted && !plantio.numBandejas">Esse campo não pode ficar em
                        branco</small>
                    </div>
                  </div>
                  <!-- <div style="margin: 1rem;" class="flex align-items-left flex-column">
                    <div class="field">
                      <label for="data">Custos de Plantio</label>
                      <div v-for="espec in especsStore.especPlantio" :key="espec.id" class="flex align-items-center">
                        <Checkbox v-model="plantio.selectedCustosPlantio" :inputId="espec.id" name="item"
                          :value="espec.item" />
                        <label :for="espec.id">{{ espec.item }}</label>
                      </div>
                    </div>
                  </div> -->
                </div>
              </template>
            </Card>
            <div class="center">
              <Button icon="pi pi-plus" label="Adicionar Microverde" rounded outlined aria-label="Filter"
                @click="addplantio" />
            </div>

            <template #footer>
              <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogLote" />
              <Button label="Salvar" icon="pi pi-check" text @click="salvarNovoLote" />
            </template>


          </Dialog>

        </div>

      </TabPanel>
      <TabPanel header="Blocos">

        <div class="flex flex-column ">
          <Button label="Cadastrar Novo Bloco" icon="pi pi-plus" class="mr-2" @click="openNewBloco" />
        </div>
        <div>
          <!-- DataTable com os blocos -->
          <DataTable :value="blocosStore.blocos" removableSort dataKey="id">
            <Column field="nome" header="Nome" sortable text-align: left;></Column>
            <Column field="plantios" header="Colheitas" text-align: left;>
              <template #body="slotProps">
                <div v-for="plantio in slotProps.data.plantios" :key="plantio.id">
                  <span style="padding: 1em">{{ plantio.dia }} </span>
                  <span style="padding: 1em">{{ plantio.especSemente.microverde }} </span>
                  <span style="padding: 1em">{{ plantio.numBandejas + ' bandejas' }} </span>
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
        <div>
          <Dialog v-model:visible="blocoDialog" :style="{ width: '70%' }" header="Novo Bloco" :modal="true"
            class="p-fluid">

            <div class="field">
              <label for="nome">Nome do Bloco</label>
              <InputText id="nome" v-model.trim="blocododialog.nome" required="true" autofocus
                :invalid="submitted && !blocododialog.nome" />
              <small class="p-error" v-if="submitted && !blocododialog.nome">Esse campo não pode ficar em
                branco</small>
            </div>
            <Card v-for="plantio in plantiosdoDialogBloco" class="cardPlantio">
              <template #header>
                <div class="p-d-flex p-jc-between ">
                  <Button icon="pi pi-times" class="p-button-rounded  p-button-contrast"
                    @click="removeplantiobloco(plantio)" aria-label="Filter" />
                </div>
              </template>
              <template #content>
                <div class="flex flex-row flex-wrap">
                  <!-- duas colulas -->
                  <div class="flex flex-column">
                    <div class="field">
                      <label for="microverde">Microverde</label>
                      <Dropdown v-model="plantio.especSemente" :options="sementesStore.especSementes"
                        optionLabel="microverde" placeholder="Microverde" checkmark :highlightOnSelect="false" />
                      <small class="p-error" v-if="submitted && !plantio.especSemente">Esse campo não pode ficar em
                        branco</small>
                    </div>
                    <div class="field">
                      <label for="data">Dia da colheita</label>
                      <Dropdown v-model="plantio.dia" :options="diasSemana" optionLabel="dia" option-value="dia"
                        checkmark :highlightOnSelect="false" />
                      <small class="p-error" v-if="submitted && !plantio.dia">Esse campo não pode ficar em
                        branco</small>
                    </div>
                    <div class="field">
                      <label for="data">Número de bandejas</label>
                      <InputNumber id="bandejas" v-model="plantio.numBandejas" required="true"
                        :invalid="submitted && !plantio.numBandejas" />

                      <small class="p-error" v-if="submitted && !plantio.numBandejas">Esse campo não pode ficar em
                        branco</small>
                    </div>
                  </div>
                  <!-- <div style="margin: 1rem;" class="flex align-items-left flex-column">
                    <div class="field">
                      <label for="data">Custos de Plantio</label>
                      <div v-for="espec in especsStore.especPlantio" :key="espec.id" class="flex align-items-center">
                        <Checkbox v-model="plantio.selectedCustosPlantio" :inputId="espec.id" name="item"
                          :value="espec.item" />
                        <label :for="espec.id">{{ espec.item }}</label>
                      </div>
                    </div>
                  </div> -->
                </div>
              </template>
            </Card>
            <div class="center">
              <Button icon="pi pi-plus" label="Adicionar Microverde" rounded outlined aria-label="Filter"
                @click="addplantiobloco" />
            </div>

            <template #footer>
              <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogBloco" />
              <Button label="Salvar" icon="pi pi-check" text @click="salvarNovoBloco" />
            </template>


          </Dialog>

        </div>


      </TabPanel>
      <TabPanel header="Custos Plantio">
        <div>
          <DataTable sortField="item" :sortOrder="1" :size=small :value="especsStore.especPlantio" dataKey="id">
            <Column v-for="col of colunasEspecs" :key="col.field" :field="col.field" sortable :header="col.header"
              style="min-width: 5rem; text-align: left;">
            </Column>
            <!--  <Column :rowEditor="true" style="width: 10%; min-width: 5rem" bodyStyle="text-align:center"></Column> -->
            <Column :exportable="false" style="min-width:5rem">
              <template #body="slotProps">
                <Button icon="pi pi-pencil" outlined severity="secondary" rounded class="mr-2"
                  @click="editEspecPlantio(slotProps.data)" />
                <Button icon="pi pi-trash" rounded severity="secondary"
                  @click="confirmDeleteEspecPlantio(slotProps.data)" />
              </template>
            </Column>
          </DataTable>
          <Toolbar class="mb-4">
            <template #start>
              <Button label="Nova" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewEspecPlantio" />
            </template>
          </Toolbar>
        </div>
        <div>
          <Dialog id="plantiodialog" v-model:visible="especDialogPlantio" :style="{ width: '450px' }"
            header="Novo custo de plantio" :modal="true" class="p-fluid">
            <div class="field">
              <label for="item">Item</label>
              <InputText id="item" v-model.trim="especdodialog.item" required="true" autofocus
                :invalid="submitted && !especdodialog.item" />
              <small class="p-error" v-if="submitted && !especdodialog.item">Esse campo não pode ficar em
                branco</small>
            </div>
            <div class="field">
              <label for="valor">Valor</label>
              <InputNumber id="valor" v-model="especdodialog.valor" required="true" mode="currency" currency="BRL"
                locale="pt-BR" autofocus :invalid="submitted && !especdodialog.valor" />
              <small class="p-error" v-if="submitted && !especdodialog.valor">Esse campo não pode ficar em
                branco</small>
            </div>

            <template #footer>
              <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogEspecPlantio" />
              <Button label="Salvar" icon="pi pi-check" text @click="salvarNovaEspecPlantio" />
            </template>
          </Dialog>
          <Dialog v-model:visible="deleteEspecDialogPlantio" :style="{ width: '450px' }" header="Confirmar"
            :modal="true">
            <div class="confirmation-content">
              <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
              <span v-if="especdodialog">Tem certeza que deseja deletar <b>{{ especdodialog.item }}</b>?</span>
            </div>
            <template #footer>
              <Button label="Não" icon="pi pi-times" text @click="deleteEspecDialogPlantio = false" />
              <Button label="Sim" icon="pi pi-check" text @click="deleteEspecPlantio" />
            </template>
          </Dialog>
        </div>
      </TabPanel>
      <TabPanel header="Custos Embalagens">

        <div>
          <DataTable sortField="item" :sortOrder="1" :size=small :value="especsStore.especEmbalagens" dataKey="id">
            <Column v-for="col of colunasEspecs" :key="col.field" :field="col.field" sortable :header="col.header"
              style="min-width: 5rem; text-align: left;">
            </Column>
            <!--  <Column :rowEditor="true" style="width: 10%; min-width: 5rem" bodyStyle="text-align:center"></Column> -->
            <Column :exportable="false" style="min-width:5rem">
              <template #body="slotProps">
                <Button icon="pi pi-pencil" outlined severity="secondary" rounded class="mr-2"
                  @click="editEspecEmbalagem(slotProps.data)" />
                <Button icon="pi pi-trash" rounded severity="secondary"
                  @click="confirmDeleteEspecEmbalagem(slotProps.data)" />
              </template>
            </Column>
          </DataTable>
          <Toolbar class="mb-4">
            <template #start>
              <Button label="Nova" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewEspecEmbalagem" />
            </template>
          </Toolbar>
        </div>
        <div>
          <Dialog id="embdialog" v-model:visible="especDialogEmbalagem" :style="{ width: '450px' }"
            header="Novo custo de embalagem" :modal="true" class="p-fluid">
            <div class="field">
              <label for="microverde">Item</label>
              <InputText id="item" v-model.trim="especdodialog.item" required="true" autofocus
                :invalid="submitted && !especdodialog.item" />
              <small class="p-error" v-if="submitted && !especdodialog.item">Esse campo não pode ficar em
                branco</small>
            </div>

            <div class="field">
              <label for="diasEmPilha">Valor</label>
              <InputNumber id="valor" v-model="especdodialog.valor" required="true" mode="currency" currency="BRL"
                locale="pt-BR" autofocus :invalid="submitted && !especdodialog.valor" />
              <small class="p-error" v-if="submitted && !especdodialog.valor">Esse campo não pode ficar em
                branco</small>
            </div>
            <template #footer>
              <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogEspecEmbalagem" />
              <Button label="Salvar" icon="pi pi-check" text @click="salvarNovaEspecEmbalagem" />
            </template>
          </Dialog>
          <Dialog v-model:visible="deleteEspecDialogEmbalagem" :style="{ width: '450px' }" header="Confirmar"
            :modal="true">
            <div class="confirmation-content">
              <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
              <span v-if="especdodialog">Tem certeza que deseja deletar <b>{{ especdodialog.item }}</b>?</span>
            </div>
            <template #footer>
              <Button label="Não" icon="pi pi-times" text @click="deleteEspecDialogEmbalagem = false" />
              <Button label="Sim" icon="pi pi-check" text @click="deleteEspecEmbalagem" />
            </template>
          </Dialog>
        </div>
      </TabPanel>

    </TabView>
  </div>


</template>

<script setup>


import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Toolbar from 'primevue/toolbar';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import Divider from 'primevue/divider';
import Checkbox from 'primevue/checkbox';




import { useSementesStore } from '../stores/sementes';
import { useLotesStore } from '../stores/lotes';
import { useBlocosStore } from '../stores/blocos';
import { useEspecsStore } from '../stores/especs';




import { onBeforeMount, onUpdated, ref, watch } from 'vue';



const sementesStore = useSementesStore();
const lotesStore = useLotesStore();
const blocosStore = useBlocosStore();
const especsStore = useEspecsStore();


const colunasEspecs = ref([
  { field: 'item', header: 'Item' },
  { field: 'valor', header: 'Valor' },
]);

const dias = ref([
  { dia: 'Domingo' },
  { dia: 'Segunda' },
  { dia: 'Terça' },
  { dia: 'Quarta' },
  { dia: 'Quinta' },
  { dia: 'Sexta' },
  { dia: 'Sábado' },
]);

const datasSemana = ref([{ data: new Date() }, { data: new Date() }, { data: new Date() }, { data: new Date() }, { data: new Date() }, { data: new Date() }, { data: new Date() }]);


const mes = ref(new Date());


const numeroMes = ref(mes.value.getMonth());
const numeroAno = ref(mes.value.getFullYear());


const selectedTipoLote = ref();
const selectedEspec = ref();
const databloco = ref();

const optionsLote = ref([{ tipo: 'Mix' }, { tipo: 'Microverde' },])



const ehEdit = ref(false);
const ehEditBloco = ref(false);
const ehEditLote = ref(false);

const blocododialog = ref({});
const lotedodialog = ref({});

const blocoDialog = ref(false);
const loteDialog = ref(false);

const submitted = ref(false);

const deleteEspecDialogPlantio = ref(false);
const deleteEspecDialogEmbalagem = ref(false);

const plantiosdoDialog = ref([]);



const small = ref('small');





const openNewLote = () => {
  ehEditLote.value = false;
  plantiosdoDialog.value = [];
  lotedodialog.value = {};
  submitted.value = false;
  loteDialog.value = true;
};

const insertblocodialog = ref(false)
const insertblocododialog = ref({})

const insertBloco = () => {
  insertblocododialog.value = {};
  submitted.value = false;
  insertblocodialog.value = true;
};


const plantiosdoDialogBloco = ref([]);


const openNewBloco = () => {
  ehEditBloco.value = false;
  plantiosdoDialogBloco.value = [];
  blocododialog.value = {};
  submitted.value = false;
  blocoDialog.value = true;
};

const hideDialogLote = () => {
  loteDialog.value = false;
  lotedodialog.value = {};
  submitted.value = false;
  plantiosdoDialog.value = [];
};

const hideDialogBloco = () => {
  blocoDialog.value = false;
  blocododialog.value = {};
  submitted.value = false;
  plantiosdoDialogBloco.value = [];
};

const hideInsertBlocoDialog = () => {
  insertblocodialog.value = false;
  insertblocododialog.value = {};
  submitted.value = false;
};



const salvarNovoLote = () => {
  submitted.value = true;

  if (lotedodialog.value.nome) {
    plantiosdoDialog.value.forEach(plantio => {
      //encontra a espec semente daquela semente
      let especPlantio = sementesStore.especSementes.find((espec) => espec.id == plantio.semente.especSemente);

      //pega no especPlantio a gramas por bandeja
      plantio.gramasBandejaPlantio = especPlantio.gramasBandejaPlantio;

      //calcula datas de plantio, blackout e estufa
      //data do plantio: data da colheita menos a quantidade de dias que está na espec semente

      plantio.dataSemeadura = new Date(plantio.dataColheita - especPlantio.diasAteAColheita * 24 * 60 * 60 * 1000);
      plantio.dataIdaBlackout = new Date(plantio.dataColheita - (especPlantio.diasAteAColheita - especPlantio.diasEmPilha) * 24 * 60 * 60 * 1000);
      plantio.dataIdaEstufa = new Date(plantio.dataColheita - (especPlantio.diasAteAColheita - especPlantio.diasEmPilha - especPlantio.blackout) * 24 * 60 * 60 * 1000);
      plantio.estado = 'Pré-plantio';

      delete plantio.semente.valorBruto
      delete plantio.semente.percentualICMS
      delete plantio.semente.fornecedor


      for (let i = 0; i < plantio.selectedCustosPlantio.length; i++) {
        let custo = especsStore.especPlantio.find((espec) => espec.item == plantio.selectedCustosPlantio[i]);
        plantio.selectedCustosPlantio[i] = { item: custo.item, valor: custo.valor };
      }

    });
    const lote = { ...lotedodialog.value, plantios: plantiosdoDialog.value };

    lotesStore.addLote(lote);

    hideDialogLote();
    calculaSemanas();
    temPlantioNoMes.value = meses.value[numeroMes.value] ? true : false;
  }
};

const salvarInsertBloco = () => {
  submitted.value = true;

  if (insertblocododialog.value.bloco) {
    const bloco = { ...insertblocododialog.value, dataColheita: insertblocododialog.value.dataColheita, plantios: insertblocododialog.value.bloco.plantios };

    blocosStore.addBloco(bloco);

    hideInsertBlocoDialog();
  }
}

const salvarNovoBloco = () => {
  submitted.value = true;

  if (blocododialog.value.nome) {
    const bloco = { ...blocododialog.value, plantios: plantiosdoDialogBloco.value };




    blocosStore.addBloco(bloco);

    hideDialogBloco();
  }
}



const achaBG = (acao) => {
  switch (acao) {
    case 'SEMEADURA':
      return '#7e3110';
    case 'BLACKOUT':
      return '#360825';
    case 'ESTUFA':
      return '#032c4d';
    case 'COLHEITA':
      return '#004540';
    default:
      return '#607744';
  }
};


const addplantio = () => {
  plantiosdoDialog.value.push({ selectedCustosPlantio: [] });
};

const addplantiobloco = () => {
  plantiosdoDialogBloco.value.push({});
};

const removeplantio = (plantio) => {
  plantiosdoDialog.value = plantiosdoDialog.value.filter(p => p !== plantio);
};
const removeplantiobloco = (plantio) => {
  plantiosdoDialogBloco.value = plantiosdoDialogBloco.value.filter(p => p !== plantio);
};

const diasSemana = ref([
  { dia: 'Domingo' },
  { dia: 'Segunda' },
  { dia: 'Terça' },
  { dia: 'Quarta' },
  { dia: 'Quinta' },
  { dia: 'Sexta' },
  { dia: 'Sábado' },
]);


const especdodialog = ref({});
const especDialogPlantio = ref(false);
const especDialogEmbalagem = ref(false);

const confirmDeleteEspecPlantio = (es) => {
  especdodialog.value = es;
  deleteEspecDialogPlantio.value = true;
};

const confirmDeleteEspecEmbalagem = (es) => {
  especdodialog.value = es;
  deleteEspecDialogEmbalagem.value = true;
};

const deleteEspecPlantio = () => {

  deleteEspecDialogPlantio.value = false;
  especsStore.deletaEspecPlantio(especdodialog.value)
  especdodialog.value = {};
};

const deleteEspecEmbalagem = () => {

  deleteEspecDialogEmbalagem.value = false;
  especsStore.deletaEspecEmbalagens(especdodialog.value)
  especdodialog.value = {};
};

const editEspecPlantio = (espec) => {
  ehEdit.value = true;
  especdodialog.value = { ...espec };
  especDialogPlantio.value = true;
};

const editEspecEmbalagem = (espec) => {
  ehEdit.value = true;
  especdodialog.value = { ...espec };
  especDialogEmbalagem.value = true;
};

const hideDialogEspecPlantio = () => {
  especDialogPlantio.value = false;
  especdodialog.value = {};
};

const hideDialogEspecEmbalagem = () => {
  especDialogEmbalagem.value = false;
  especdodialog.value = {};
};

const especvalido = () => {
  return especdodialog.value.item !== '' &&
    especdodialog.value.item !== null &&
    especdodialog.value.valor !== '' &&
    especdodialog.value.valor !== null
    ;
};

const salvarNovaEspecPlantio = () => {
  submitted.value = true;
  if (especvalido()) {
    ehEdit.value ? especsStore.setaEspecPlantio(especdodialog.value) : especsStore.addEspecPlantio(especdodialog.value);
    especDialogPlantio.value = false;
    especdodialog.value = {};
    submitted.value = false;
  }
  // salva novaespec no banco e fecha o dialog
};
const salvarNovaEspecEmbalagem = () => {
  submitted.value = true;
  if (especvalido()) {
    ehEdit.value ? especsStore.setaEspecEmbalagens(especdodialog.value) : especsStore.addEspecEmbalagens(especdodialog.value);
    especDialogEmbalagem.value = false;
    especdodialog.value = {};
    submitted.value = false;
  }
  // salva novaespec no banco e fecha o dialog
};

/* const openNewEspec = () => {
  ehEdit.value = false;
  especdodialog.value = {};
  submitted.value = false;
  especDialog.value = true;
}; */

const openNewEspecPlantio = () => {
  ehEdit.value = false;
  especdodialog.value = {};
  submitted.value = false;
  especDialogPlantio.value = true;
};

const openNewEspecEmbalagem = () => {
  ehEdit.value = false;
  especdodialog.value = {};
  submitted.value = false;
  especDialogEmbalagem.value = true;
};



/* watch(() => lotesStore.lotes, () => {
  geraLotesPeloLotesStore();
});
 */
//const lotes = ref([]);

/* const geraLotesPeloLotesStore = () => {
  lotes.value = useLotesStore().lotes;
}; */

const anos = ref([])
const meses = ref([]);
const temPlantioNoMes = ref(false);


watch(() => mes.value, () => {
  numeroMes.value = mes.value.getMonth();
  numeroAno.value = mes.value.getFullYear();
  console.log(lotesStore.lotes);
  temPlantioNoMes.value = meses.value[numeroMes.value] ? true : false;

});

watch(() => lotesStore.lotes, () => {
  calculaSemanas();
  console.log(lotesStore.lotes);
  //verifica se tem plantio no mes
  temPlantioNoMes.value = meses.value[numeroMes.value] ? true : false;
});






/* A estrutura dos meses se dará da seguinte forma:
meses = [
  [semana1, semana2, semana3, ...], // janeiro
  [semana1, semana2, semana3, ...], // fevereiro
  ...
  [semana1, semana2, semana3, ...] // dezembro
] onde semana = {diaInicio: Date, diaFim: Date, acoesplantios: [acaoplantio1, acaoplantio2, ...]}
 e onde acaoplantio = {lote: Lote, plantio: Plantio, acao: string}
 e onde acao = 'plantio', 'blackout', 'estufa', 'colheita'
 
A semana começa no domingo e termina no sábado
 
*/


const calculaSemanas = () => {
  meses.value = [];
  lotesStore.lotes.forEach(lote => {
    lote.plantios.forEach(plantio => {
      let dataColheita = plantio.dataColheita.toDate();
      let dataSemeadura = plantio.dataSemeadura.toDate();
      let dataIdaBlackout = plantio.dataIdaBlackout.toDate();
      let dataIdaEstufa = plantio.dataIdaEstufa.toDate();

      let datas = [{ acao: 'SEMEADURA', data: dataSemeadura }, { acao: 'BLACKOUT', data: dataIdaBlackout }, { acao: 'ESTUFA', data: dataIdaEstufa }, { acao: 'COLHEITA', data: dataColheita }];
      datas.forEach(data => {


        //Calcula o primeiro dia da semana de acordo com a data.data
        var diaSemana = data.data.getDay();
        var inicioSemana = new Date(data.data);


        inicioSemana.setDate(data.data.getDate() - diaSemana);
        var finalSemana = new Date(inicioSemana);
        finalSemana.setDate(inicioSemana.getDate() + 6);


        var numMes = inicioSemana.getMonth();

        //se em 'meses[numMes]', onde numMes é o mes do diaInicio da semana, não existir a semana, cria um array vazio, cria a semana e adiciona a acao; senão, adiciona a acao
        if (!meses.value[numMes]) {
          let semana = { diaInicio: inicioSemana.getDate(), dias: [[], [], [], [], [], [], []] };
          semana.dias[data.data.getDay()] = [{ data: data.data, lote: lote.nome, plantio: plantio.semente.microverde, acao: data.acao }];
          meses.value[numMes] = [];
          //pega o dia do mes do inicio da semana para usar de indice no objeto mes para adicionar a semana no mes
          meses.value[numMes][inicioSemana.getDate()] = semana;
          meses.value[numMes].semanas = [{ domingo: inicioSemana.getDate(), domingoDate: inicioSemana, titulo: (inicioSemana.toLocaleDateString().slice(0, -5) + ' - ' + finalSemana.toLocaleDateString()).slice(0, -5) }];
          //meses.value[numMes] = {  inicioSemana = semana}
        } else {
          //se a semana já existir, adiciona a acao a semana, senão, cria um array vazio e adiciona a acao
          if (!meses.value[numMes][inicioSemana.getDate()]) {
            let semana = { diaInicio: inicioSemana.getDate(), dias: [[], [], [], [], [], [], []] };
            semana.dias[data.data.getDay()] = [{ data: data.data, lote: lote.nome, plantio: plantio.semente.microverde, acao: data.acao }];
            meses.value[numMes][inicioSemana.getDate()] = semana;
            meses.value[numMes].semanas.push({ domingo: inicioSemana.getDate(), domingoDate: inicioSemana, titulo: (inicioSemana.toLocaleDateString().slice(0, -5) + ' - ' + finalSemana.toLocaleDateString()).slice(0, -5) });
          } else {
            if (!meses.value[numMes][inicioSemana.getDate()].dias[data.data.getDay()]) {
              meses.value[numMes][inicioSemana.getDate()].dias[data.data.getDay()] = [{ data: data.data, lote: lote.nome, plantio: plantio.semente.microverde, acao: data.acao }];
            }
            else {
              meses.value[numMes][inicioSemana.getDate()].dias[data.data.getDay()].push({ data: data.data, lote: lote.nome, plantio: plantio.semente.microverde, acao: data.acao });
            }
          }
        }
      });
    });
  });
  //ordena cada semana de cada mes por data
  meses.value.forEach(mes => {

    //transforma domingo em numero
    mes.semanas.sort((a, b) => a.domingo - b.domingo);


  });



};



onBeforeMount(() => {


  sementesStore.fetchSementes();
  sementesStore.fetchEspecSementes();
  lotesStore.fetchLotes()
  blocosStore.fetchBlocos();
  especsStore.fetchEspecPlantio();
  especsStore.fetchEspecEmbalagens();


});


</script>

<style>
@media (min-width: 1024px) {
  .admin {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
