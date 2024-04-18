<template>
  <div class="flex flex-column ">
    <TabView>

      <TabPanel header="Produção">
        <div>
          <!-- <DataTable :value="sementesStore.sementes" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20]">
            <Column field="microverde" header="Microverde"></Column>
            <Column field="fornecedor" header="Fornecedor"></Column>
            <Column field="valorBruto" header="Preço"></Column>
            <Column field="percentualICMS" header="% ICMS"></Column>
          </DataTable> -->

          <!-- <DataTable sortField="microverde" :sortOrder="1" :size=small :value="sementesStore.sementes" dataKey="id">
            <Column v-for="col of colunasSementes" :key="col.field" :field="col.field" sortable :header="col.header"
              style="min-width: 5rem; text-align: center;">
            </Column>
            <Column :exportable="false" style="min-width:5rem">
              <template #body="slotProps">
                <Button icon="pi pi-pencil" outlined severity="secondary" rounded class="mr-2"
                  @click="editSemente(slotProps.data)" />
                <Button icon="pi pi-trash" rounded severity="secondary" @click="confirmDeleteSemente(slotProps.data)" />
              </template>
</Column>
</DataTable> -->
          <Toolbar class="mb-4">
            <template #start>
              <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewBloco" />
            </template>
          </Toolbar>

        </div>
      </TabPanel>


      <TabPanel header="Caixas" :disabled="false">

        <!-- <DataTable sortField="microverde" :sortOrder="1" :size=small :value="sementesStore.especSementes" dataKey="id">
          <Column v-for="col of colunasEspecSementes" :key="col.field" :field="col.field" sortable :header="col.header"
            style="min-width: 5rem; text-align: center;">
            
          </Column>

          
          <Column :exportable="false" style="min-width:5rem">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" outlined severity="secondary" rounded class="mr-2"
                @click="editEspec(slotProps.data)" />
              <Button icon="pi pi-trash" rounded severity="secondary" @click="confirmDeleteEspec(slotProps.data)" />
            </template>
          </Column>
        </DataTable>
      -->
        <Toolbar class="mb-4">
          <template #start>
            <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewEspec" />
          </template>
        </Toolbar>
      </TabPanel>
    </TabView>
  </div>

  <div>

    <Dialog v-model:visible="blocoDialog" :style="{ width: '450px' }" header="Novo Bloco" :modal="true" class="p-fluid">

      <div class="field">
        <label for="icondisplay" class="font-bold block mb-2"> Selecione a data do bloco </label>
        <Calendar v-model="databloco" showIcon iconDisplay="input" inputId="icondisplay" />
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogBloco" />
        <Button label="Salvar" icon="pi pi-check" text @click="salvarNovaBloco" />
      </template>


    </Dialog>

  </div>

  <div>

    <Dialog v-model:visible="loteDialog" :style="{ width: '450px' }" header="Nova lote" :modal="true" class="p-fluid">

      <div class="field">
        <label for="bloco">Bloco</label>
        <InputText id="bloco" v-model.trim="lotedodialog.bloco" required="true" autofocus
          :invalid="submitted && !lotedodialog.bloco" />
        <small class="p-error" v-if="submitted && !lotedodialog.bloco">Esse campo não pode ficar em
          branco</small>
      </div>
      <div class="field">
        <label for="icondisplay" class="font-bold block mb-2"> Bloco </label>
        <Calendar v-model="databloco" showIcon iconDisplay="input" inputId="icondisplay" />
      </div>
      <div class="field">
        <label for="microverde">Semente</label>
        <Dropdown v-model="selectedSemente" :options="sementesStore.sementes" optionLabel="microverde"
          placeholder="Selecione a semente" checkmark :highlightOnSelect="false" />
        <small class="p-error" v-if="submitted && !lotedodialog.microverde">Esse campo não pode ficar em
          branco</small>
      </div>

      <div class="field">
        <label for="microverde">Especificação</label>
        <Dropdown v-model="selectedEspec" :options="sementesStore.especSementes" optionLabel="microverde"
          placeholder="Selecione a especificação" checkmark :highlightOnSelect="false" />
        <small class="p-error" v-if="submitted && !lotedodialog.espec">Esse campo não pode ficar em
          branco</small>
      </div>


      <div class="field">
        <label for="valorBruto">Preço</label>
        <InputNumber id="valorBruto" v-model="lotedodialog.valorBruto" required="true" autofocus
          :invalid="submitted && !lotedodialog.valorBruto" inputId="minmaxfraction" :minFractionDigits="2"
          :maxFractionDigits="2" />
        <small class="p-error" v-if="submitted && !lotedodialog.valorBruto">Esse campo não pode ficar em
          branco</small>
      </div>
      <div class="field">
        <label for="percentualICMS">Percentual ICMS</label>
        <InputNumber id="percentualICMS" v-model="lotedodialog.percentualICMS" required="true" autofocus
          :invalid="submitted && !lotedodialog.percentualICMS" suffix="%" />
        <small class="p-error" v-if="submitted && !lotedodialog.percentualICMS">Esse campo não pode ficar em
          branco</small>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogSemente" />
        <Button label="Salvar" icon="pi pi-check" text @click="salvarNovaSemente" />
      </template>


    </Dialog>

  </div>

  <div>
    <Dialog v-model:visible="especDialog" :style="{ width: '450px' }" header="Nova especificação" :modal="true"
      class="p-fluid">

      <div class="field">
        <label for="microverde">Microverde</label>
        <InputText id="microverde" v-model.trim="especdodialog.microverde" required="true" autofocus
          :invalid="submitted && !especdodialog.microverde" />
        <small class="p-error" v-if="submitted && !especdodialog.microverde">Esse campo não pode ficar em branco</small>
      </div>

      <div class="field">
        <label for="diasEmPilha">Dias em Pilha</label>
        <InputNumber id="diasEmPilha" v-model="especdodialog.diasEmPilha" required="true" autofocus
          :invalid="submitted && !especdodialog.diasEmPilha" />
        <small class="p-error" v-if="submitted && !especdodialog.diasEmPilha">Esse campo não pode ficar em
          branco</small>
      </div>

      <div class="field">
        <label for="blackout">Blackout</label>
        <InputNumber id="blackout" v-model="especdodialog.blackout" required="true" autofocus
          :invalid="submitted && !especdodialog.blackout" />
        <small class="p-error" v-if="submitted && !especdodialog.blackout">Esse campo não pode ficar em branco</small>
      </div>

      <div class="field">
        <label for="diasAteAColheita">Dias até a colheita</label>
        <InputNumber id="diasAteAColheita" v-model="especdodialog.diasAteAColheita" required="true" autofocus
          :invalid="submitted && !especdodialog.diasAteAColheita" />
        <small class="p-error" v-if="submitted && !especdodialog.diasAteAColheita">Esse campo não pode ficar em
          branco</small>
      </div>

      <div class="field">
        <label for="gramasBandejaPlantio">Gramas para plantio</label>
        <InputNumber id="gramasBandejaPlantio" v-model="especdodialog.gramasBandejaPlantio" required="true" autofocus
          :invalid="submitted && !especdodialog.gramasBandejaPlantio" />
        <small class="p-error" v-if="submitted && !especdodialog.gramasBandejaPlantio">Esse campo não pode ficar em
          branco</small>
      </div>

      <div class="field">
        <label for="gramasBandejaPlantio">Produção estimada por bandeja</label>
        <InputNumber id="gramasBandejaPlantio" v-model="especdodialog.gramasBandejaProducao" required="true" autofocus
          :invalid="submitted && !especdodialog.gramasBandejaProducao" />
        <small class="p-error" v-if="submitted && !especdodialog.gramasBandejaProducao">Esse campo não pode ficar em
          branco</small>
      </div>





      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialogEspec" />
        <Button label="Salvar" icon="pi pi-check" text @click="salvarNovaEspec" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteSementeDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="lotedodialog">Tem certeza que deseja deletar <b>{{ lotedodialog.microverde }}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteSementeDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteSemente" />
      </template>
    </Dialog>


    <Dialog v-model:visible="deleteEspecDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="especdodialog">Tem certeza que deseja deletar <b>{{ especdodialog.microverde }}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" text @click="deleteEspecDialog = false" />
        <Button label="Yes" icon="pi pi-check" text @click="deleteEspec" />
      </template>
    </Dialog>




  </div>


</template>

<script setup>


import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Toolbar from 'primevue/toolbar';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';




import { useSementesStore } from '../stores/sementes';




import { onBeforeMount, onUpdated, ref, watch } from 'vue';




const selectedSemente = ref();
const selectedEspec = ref();
const databloco = ref();

watch(selectedSemente, (newX) => {

  //encontrar a espec que o inicio do nome do microverde é igual ao microverde selecionado

  sementesStore.especSementes.findIndex((espec) => {
    if (espec.microverde.startsWith(selectedSemente.value.microverde.split())) {
      selectedEspec.value = { ...espec };
    }
  })
})

const ehEdit = ref(false);
const ehEditBloco = ref(false);
const ehEditLote = ref(false);

const blocododialog = ref({});
const lotedodialog = ref({});

const blocoDialog = ref(false);
const loteDialog = ref(false);

const submitted = ref(false);

const deleteEspecDialog = ref(false);
const deleteSementeDialog = ref(false);

const editSemente = (semente) => {
  ehEdit.value = true;
  lotedodialog.value = { ...semente };
  loteDialog.value = true;
};

const editEspec = (espec) => {
  ehEdit.value = true;
  especdodialog.value = { ...espec };
  especDialog.value = true;
};

const small = ref('small');

const openNewSemente = () => {
  ehEdit.value = false;
  lotedodialog.value = {};
  submitted.value = false;
  loteDialog.value = true;
};

const openNewBloco = () => {
  ehEditBloco.value = false;
  blocododialog.value = {};
  submitted.value = false;
  blocoDialog.value = true;
};

const openNewEspec = () => {
  ehEdit.value = false;
  especdodialog.value = {};
  submitted.value = false;
  especDialog.value = true;
};

const sementevalido = () => {
  return lotedodialog.value.microverde !== '' &&
    lotedodialog.value.microverde !== null &&
    lotedodialog.value.fornecedor !== '' &&
    lotedodialog.value.fornecedor !== null &&
    lotedodialog.value.valorBruto !== '' &&
    lotedodialog.value.valorBruto !== null &&
    lotedodialog.value.percentualICMS !== '' &&
    lotedodialog.value.percentualICMS !== null;
};

const blocovalido = () => {
  return lotedodialog.value.bloco !== '' &&
    lotedodialog.value.bloco !== null;
};



const salvarNovaBloco = () => {
  submitted.value = true;
  if (blocovalido()) {
    ehEditBloco.value ? sementesStore.setaBloco(blocododialog.value) : sementesStore.addBloco(blocododialog.value);
    blocoDialog.value = false;
    blocododialog.value = {};
    submitted.value = false;
  }
  // salva novabloco no banco e fecha o dialog
};


const salvarNovaSemente = () => {
  submitted.value = true;
  if (sementevalido()) {
    ehEdit.value ? sementesStore.setaSemente(lotedodialog.value) : sementesStore.addSemente(lotedodialog.value);
    loteDialog.value = false;
    lotedodialog.value = {};
    submitted.value = false;
  }
  // salva novasemente no banco e fecha o dialog
};

const salvarNovaEspec = () => {
  submitted.value = true;
  if (especvalido()) {
    ehEdit.value ? sementesStore.setaEspecSemente(especdodialog.value) : sementesStore.addEspecSemente(especdodialog.value);
    especDialog.value = false;
    especdodialog.value = {};
    submitted.value = false;
  }
  // salva novaespec no banco e fecha o dialog


};

const hideDialogSemente = () => {
  loteDialog.value = false;
  lotedodialog.value = {};
};

const hideDialogEspec = () => {
  especDialog.value = false;
  especdodialog.value = {};
};

const confirmDeleteSemente = (semente) => {
  lotedodialog.value = semente;
  deleteSementeDialog.value = true;
};

const confirmDeleteEspec = (es) => {
  especdodialog.value = es;
  deleteEspecDialog.value = true;
};

const deleteSemente = () => {

  deleteSementeDialog.value = false;
  sementesStore.deletaSemente(lotedodialog.value)
  lotedodialog.value = {};
};

const deleteEspec = () => {

  deleteEspecDialog.value = false;
  sementesStore.deletaEspecSemente(especdodialog.value)
  especdodialog.value = {};
};



const sementesStore = useSementesStore();

const colunasSementes = ref([
  { field: 'microverde', header: 'Microverde' },
  { field: 'fornecedor', header: 'Fornecedor' },
  { field: 'valorBruto', header: 'Preço' },
  { field: 'percentualICMS', header: '% ICMS' }
]);

const colunasEspecSementes = ref([
  { field: 'microverde', header: 'Microverde' },
  { field: 'diasEmPilha', header: 'Dias em Pilha' },
  { field: 'blackout', header: 'Blackout' },
  { field: 'diasAteAColheita', header: 'Dias até a colheita' },
  { field: 'gramasBandejaPlantio', header: 'Gramas para plantio' },
  { field: 'gramasBandejaProducao', header: 'Produção estimada por bandeja' }
]);
/* const editingRows = ref([]); */

/* function onRowEditSave(event) {
  let { newData } = event;
  sementesStore.setaEspecSemente(newData);
} */

onBeforeMount(() => {
  sementesStore.fetchSementes();
  sementesStore.fetchEspecSementes();

});

/* onUpdated(() => {
//  sementesStore.fetchSementes();
//  sementesStore.fetchEspecSementes();
});
 */
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
