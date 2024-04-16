<template>
  <div class="flex flex-column ">
    <TabView>

      <TabPanel header="Sementes">
        <div>
          <DataTable :value="sementesStore.sementes" :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20]">
            <Column field="microverde" header="Microverde"></Column>
            <Column field="fornecedor" header="Fornecedor"></Column>
            <Column field="valorBruto" header="Preço"></Column>
            <Column field="percentualICMS" header="% ICMS"></Column>
          </DataTable>
        </div>
      </TabPanel>

      <!-- <TabPanel header="Especificações">
        <div>
          <DataTable :value="sementesStore.especSementes" editMode="row" @row-edit-save="onRowEditSave"
            :paginator="true" :rows="10" :rowsPerPageOptions="[5, 10, 20]" :pt="{
            table: { style: 'min-width: 50rem' },
            column: {
              bodycell: ({ state }) => ({
                style: state['d_editing'] && 'padding-top: 0.6rem; padding-bottom: 0.6rem'
              })
            }
          }">
            <Column field="microverde" header="Microverde"></Column>
            <Column field="diasEmPilha" header="Dias em Pilha"></Column>
            <Column field="blackout" header="Blackout"></Column>
            <Column field="diasAteAColheita" header="Dias até a colheita"></Column>
            <Column field="gramasBandejaPlantio" header="Gramas para plantio"></Column>
            <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center"></Column>
          </DataTable>
        </div>

      </TabPanel> -->
      <TabPanel header="Especificações" :disabled="false">

        <DataTable sortField="microverde" :sortOrder="1" :size=small v-model:editingRows="editingRows"
          :value="sementesStore.especSementes" editMode="row" dataKey="id" @row-edit-save="onRowEditSave" :pt="{
            table: { style: 'min-width: 5rem' },
            column: {
              bodycell: ({ state }) => ({
                style: state['d_editing'] && 'padding-top: 0.6rem; padding-bottom: 0.6rem;  min-width: 5rem'
              })
            }
          }">
          <Column v-for="col of colunas" :key="col.field" :field="col.field" sortable :header="col.header"
            style="min-width: 5rem; text-align: center;">
            <!--  <template #body="{ data, field }">
              {{ data[field] }}
            </template> -->
            <template #editor="{ data, field }">
              <template v-if="field !== 'microverde'">
                <InputNumber v-model="data[field]" autofocus />
              </template>
              <template v-else="field !== 'microverde'">
                <InputText v-model="data[field]" autofocus />
              </template>
            </template>
          </Column>

          <!--  <Column :rowEditor="true" style="width: 10%; min-width: 5rem" bodyStyle="text-align:center"></Column> -->
          <Column :exportable="false" style="min-width:5rem">
            <template #body="slotProps">
              <Button icon="pi pi-pencil" outlined severity="secondary" rounded class="mr-2"
                @click="editEspec(slotProps.data)" />
              <Button icon="pi pi-trash" rounded severity="secondary" @click="confirmDeleteEspec(slotProps.data)" />
            </template>
          </Column>
        </DataTable>
        <Toolbar class="mb-4">
          <template #start>
            <Button label="New" icon="pi pi-plus" severity="success" class="mr-2" @click="openNew" />
          </template>
        </Toolbar>
      </TabPanel>
    </TabView>
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





      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="hideDialog" />
        <Button label="Salvar" icon="pi pi-check" text @click="salvarNovaEspec" />
      </template>
    </Dialog>

    <Dialog v-model:visible="deleteEspecDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="especdodialog">Are you sure you want to delete <b>{{ especdodialog.microverde }}</b>?</span>
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
import { useToast } from 'primevue/usetoast';

const toast = useToast();


import { useSementesStore } from '../stores/sementes';




import { onBeforeMount, onUpdated, ref } from 'vue';

const ehEdit = ref(false);

const especdodialog = ref({});
const especDialog = ref(false);
const submitted = ref(false);

const deleteEspecDialog = ref(false);

const editEspec = (espec) => {
  ehEdit.value = true;
  especdodialog.value = { ...espec };
  especDialog.value = true;
};

const small = ref('small');

const openNew = () => {
  ehEdit.value = false;
  especdodialog.value = {};
  submitted.value = false;
  especDialog.value = true;
};

const salvarNovaEspec = () => {
  submitted.value = true;
  /* console.log(especdodialog.value);
  console.log(ehEdit.value); */
  ehEdit.value ? sementesStore.setaEspecSemente(especdodialog.value) : sementesStore.salvaNovaEspecSemente(especdodialog.value);
  // salva novaespec no banco e fecha o dialog
  especDialog.value = false;
  especdodialog.value = {};

};
const hideDialog = () => {
  especDialog.value = false;
  especdodialog.value = {};
};

const confirmDeleteEspec = (es) => {
  especdodialog.value = es;
  deleteEspecDialog.value = true;
};

const deleteEspec = () => {
  /* especdodialog.value = products.value.filter(val => val.id !== product.value.id); */
  deleteEspecDialog.value = false;


  sementesStore.deletaEspecSemente(especdodialog.value).then(() => {
    toast.add({ severity: 'success', summary: 'Successful', detail: 'Especificação deletada', life: 3000 });
  })
  especdodialog.value = {};
};



const sementesStore = useSementesStore();
const colunas = ref([
  { field: 'microverde', header: 'Microverde' },
  { field: 'diasEmPilha', header: 'Dias em Pilha' },
  { field: 'blackout', header: 'Blackout' },
  { field: 'diasAteAColheita', header: 'Dias até a colheita' },
  { field: 'gramasBandejaPlantio', header: 'Gramas para plantio' },
]);
const editingRows = ref([]);

function onRowEditSave(event) {
  let { newData } = event;
  sementesStore.setaEspecSemente(newData);
}

onBeforeMount(() => {
  sementesStore.fetchSementes();
  sementesStore.fetchEspecSementes();

});

onUpdated(() => {
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
