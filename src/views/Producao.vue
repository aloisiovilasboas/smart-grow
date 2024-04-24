<template>
  <div class="flex flex-column ">
    <TabView>

      <TabPanel header="Lotes">

        <div class="flex flex-column ">
          <Button label="Novo Lote" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewLote" />
        </div>
        <div>
          <DataTable :value="lotesStore.lotes" dataKey="id" class="datatable">
            <Column field="nome" header="Nome" sortable></Column>
            <Column field="tipo" header="Tipo" sortable></Column>
            <Column field="plantios" header="Plantios" sortable></Column>
          </DataTable>
        </div>
        <div>

          <Dialog v-model:visible="loteDialog" :style="{ width: '70%' }" header="Novo Lote" :modal="true"
            class="p-fluid">
            <div class="field">
              <label for="nome">Nome do lote</label>
              <InputText id="nome" v-model.trim="lotedodialog.nome" required="true" autofocus
                :invalid="submitted && !lotedodialog.nome" />
              <small class="p-error" v-if="submitted && !lotedodialog.nome">Esse campo não pode ficar em branco</small>
            </div>
            <Card v-for="plantio in plantiosdoDialog" class="cardPlantio">
              <template #header>
                <div class="p-d-flex p-jc-between ">

                  <Button icon="pi pi-times" class="p-button-rounded p-button-text p-button-danger"
                    @click="removeplantio(plantio)" aria-label="Filter" />
                </div>
              </template>
              <template #content>
                <div class="flex flex-row flex-wrap">
                  <!-- duas colulas -->
                  <div class="flex flex-column">
                    <div class="field">
                      <label for="microverde">Semente</label>
                      <Dropdown v-model="plantio.semente" :options="sementesStore.sementes" optionLabel="microverde"
                        placeholder="Semente" checkmark :highlightOnSelect="false" />
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
                  <div style="margin: 1rem;" class="flex align-items-left flex-column">
                    <div class="field">
                      <label for="data">Custos de Plantio</label>
                      <div v-for="espec in especsStore.especPlantio" :key="espec.id" class="flex align-items-center">
                        <Checkbox v-model="plantio.selectedCustosPlantio" :inputId="espec.id" name="item"
                          :value="espec.item" />
                        <label :for="espec.id">{{ espec.item }}</label>
                      </div>
                    </div>


                  </div>

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
import { useEspecsStore } from '../stores/especs';




import { onBeforeMount, onUpdated, ref, watch } from 'vue';

const colunasEspecs = ref([
  { field: 'item', header: 'Item' },
  { field: 'valor', header: 'Valor' },
]);




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

const hideDialogLote = () => {
  loteDialog.value = false;
  lotedodialog.value = {};
  submitted.value = false;
  plantiosdoDialog.value = [];
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
      // log especSemente
      /* console.log('especSemente', especPlantio.diasEmPilha);
      console.log('semeadura', plantio.dataSemeadura);
      console.log('blackout', plantio.dataIdaBlackout);
      console.log('estufa', plantio.dataIdaEstufa);
      console.log('colheita', plantio.dataColheita); */

      /*  plantio.dataPlantio = new Date(plantio.dataColheita); */


      /* console.log(especPlantio); */
    });
    const lote = { ...lotedodialog.value, plantios: plantiosdoDialog.value };
    // console.log(lote);
    useLotesStore().addLote(lote);

    hideDialogLote();
  }
};


const addplantio = () => {
  plantiosdoDialog.value.push({ selectedCustosPlantio: [] });
};

const removeplantio = (plantio) => {
  plantiosdoDialog.value = plantiosdoDialog.value.filter(p => p !== plantio);
};

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



const sementesStore = useSementesStore();
const lotesStore = useLotesStore();
const especsStore = useEspecsStore();


onBeforeMount(() => {
  sementesStore.fetchSementes();
  sementesStore.fetchEspecSementes();
  lotesStore.fetchLotes();
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
