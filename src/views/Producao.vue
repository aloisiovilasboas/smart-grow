<template>
  <div class="flex flex-column ">
    <Button label="Novo Lote" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewLote" />
  </div>

  <div>

    <Dialog v-model:visible="loteDialog" :style="{ width: '70%' }" header="Novo Lote" :modal="true" class="p-fluid">


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
          <div class="field">
            <label for="microverde">Semente</label>
            <Dropdown v-model="plantio.semente" :options="sementesStore.sementes" option-value="id"
              optionLabel="microverde" placeholder="Semente" checkmark :highlightOnSelect="false" />
            <small class="p-error" v-if="submitted && !plantio.semente">Esse campo não pode ficar em
              branco</small>
          </div>
          <div class="field">
            <label for="data">Data da colheita</label>
            <Calendar id="data" v-model="plantio.dataColheita" required="true" :invalid="submitted && !plantio.data" />
            <small class="p-error" v-if="submitted && !plantio.dataColheita">Esse campo não pode ficar em branco</small>
          </div>

          <div class="field">
            <label for="data">Número de bandejas</label>
            <InputNumber id="bandejas" v-model="plantio.numBandejas" required="true"
              :invalid="submitted && !plantio.numBandejas" />

            <small class="p-error" v-if="submitted && !plantio.numBandejas">Esse campo não pode ficar em
              branco</small>
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




import { useSementesStore } from '../stores/sementes';
import { useBlocosStore } from '../stores/blocos';
import { useLotesStore } from '../stores/lotes';




import { onBeforeMount, onUpdated, ref, watch } from 'vue';




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

const deleteEspecDialog = ref(false);
const deleteBlocoDialog = ref(false);
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
    const lote = { ...lotedodialog.value, plantios: plantiosdoDialog.value };
    // console.log(lote);
    useLotesStore().addLote(lote);

    hideDialogLote();
  }
};


const addplantio = () => {
  plantiosdoDialog.value.push({});
};

const removeplantio = (plantio) => {
  plantiosdoDialog.value = plantiosdoDialog.value.filter(p => p !== plantio);
};


const sementesStore = useSementesStore();


onBeforeMount(() => {
  sementesStore.fetchSementes();
  sementesStore.fetchEspecSementes();

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
