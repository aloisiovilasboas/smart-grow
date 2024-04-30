<template>
  <div class="flex flex-column ">
    <TabView>

      <TabPanel header="Estoque Sementes">
        <div>


          <DataTable sortField="microverde" :sortOrder="1" :size=small :value="sementesStore.sementes" dataKey="id">
            <Column v-for="col of colunasSementes" :key="col.field" :field="col.field" sortable :header="col.header"
              style="min-width: 5rem; text-align: center;">
              <template #body="{ data, field }" v-if="col.field == 'especSemente'">
                {{ achaEspec(data[field]) }}
              </template>
              <template #body="{ data, field }" v-else>
                {{ data[field] }}
              </template>
            </Column>
            <!-- coluna com o valor final calculado pelo percentual de ICMS -->

            <Column field="valorFinal" header="Valor Final" style="min-width: 5rem; text-align: center;">
              <template #body="{ data }">
                {{ (data.valorBruto * (1 + data.percentualICMS / 100)).toFixed(2) }}
              </template>

            </Column>
            <Column :exportable="false" style="min-width:5rem">
              <template #body="slotProps">
                <Button icon="pi pi-pencil" outlined severity="secondary" rounded class="mr-2"
                  @click="editSemente(slotProps.data)" />
                <Button icon="pi pi-trash" rounded severity="secondary" @click="confirmDeleteSemente(slotProps.data)" />
              </template>
            </Column>
          </DataTable>
          <Toolbar class="mb-4">
            <template #start>
              <Button label="Nova" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewSemente" />
            </template>
          </Toolbar>

        </div>
      </TabPanel>


      <TabPanel header="Especificações" :disabled="false">

        <DataTable sortField="microverde" :sortOrder="1" :size=small :value="sementesStore.especSementes" dataKey="id">
          <Column v-for=" col  of  colunasEspecSementes " :key="col.field" :field="col.field" sortable
            :header="col.header" style="min-width: 5rem; text-align: center;">

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
            <Button label="Nova" icon="pi pi-plus" severity="success" class="mr-2" @click="openNewEspec" />
          </template>
        </Toolbar>
      </TabPanel>
    </TabView>
  </div>

  <div>
    <Dialog v-model:visible="sementeDialog" :style="{ width: '450px' }" header="Nova semente" :modal="true"
      class="p-fluid">
      <div class="field">
        <label for="microverde">Microverde</label>
        <InputText id="microverde" v-model.trim="sementedodialog.microverde" required="true" autofocus
          :invalid="submitted && !sementedodialog.microverde" />
        <small class="p-error" v-if="submitted && !sementedodialog.microverde">Esse campo não pode ficar em
          branco</small>
      </div>
      <div class="field">
        <label for="especSemente"> Especificação </label>
        <Dropdown id="especSemente" v-model="sementedodialog.especSemente" filter :options="sementesStore.especSementes"
          optionLabel="microverde" optionValue="id" placeholder="Selecione uma especificação"
          :invalid="submitted && !sementedodialog.especSemente" />

        <small class="p-error" v-if="submitted && !sementedodialog.especSemente">Esse campo não pode ficar em
          branco</small>

      </div>
      <div class="field">
        <label for="fornecedor">Fornecedor</label>
        <InputText id="fornecedor" v-model.trim="sementedodialog.fornecedor" required="true" autofocus
          :invalid="submitted && !sementedodialog.fornecedor" />
        <small class="p-error" v-if="submitted && !sementedodialog.fornecedor">Esse campo não pode ficar em
          branco</small>
      </div>
      <div class="field">
        <label for="valorBruto">Preço</label>
        <InputNumber id="valorBruto" v-model="sementedodialog.valorBruto" required="true" autofocus
          :invalid="submitted && !sementedodialog.valorBruto" inputId="minmaxfraction" :minFractionDigits="2"
          :maxFractionDigits="2" />
        <small class="p-error" v-if="submitted && !sementedodialog.valorBruto">Esse campo não pode ficar em
          branco</small>
      </div>
      <div class="field">
        <label for="percentualICMS">Percentual ICMS</label>
        <InputNumber id="percentualICMS" v-model="sementedodialog.percentualICMS" required="true" autofocus
          :invalid="submitted && !sementedodialog.percentualICMS" suffix="%" />
        <small class="p-error" v-if="submitted && !sementedodialog.percentualICMS">Esse campo não pode ficar em
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
        <small class="p-error" v-if="submitted && !especdodialog.microverde">Esse campo não pode ficar em
          branco</small>
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
        <span v-if="sementedodialog">Tem certeza que deseja deletar <b>{{ sementedodialog.microverde }}</b>?</span>
      </div>
      <template #footer>
        <Button label="Não" icon="pi pi-times" text @click="deleteSementeDialog = false" />
        <Button label="Sim" icon="pi pi-check" text @click="deleteSemente" />
      </template>
    </Dialog>


    <Dialog v-model:visible="deleteEspecDialog" :style="{ width: '450px' }" header="Confirmar" :modal="true">
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="especdodialog">Tem certeza que deseja deletar <b>{{ especdodialog.microverde }}</b>?</span>
      </div>
      <template #footer>
        <Button label="Não" icon="pi pi-times" text @click="deleteEspecDialog = false" />
        <Button label="Sim" icon="pi pi-check" text @click="deleteEspec" />
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




import { useSementesStore } from '../stores/sementes';




import { onBeforeMount, onUpdated, ref, watch } from 'vue';



const ehEdit = ref(false);
const selectedEspec = ref();

const especdodialog = ref({});
const sementedodialog = ref({ microverde: '' });

const especDialog = ref(false);
const sementeDialog = ref(false);

const submitted = ref(false);

const deleteEspecDialog = ref(false);
const deleteSementeDialog = ref(false);






const editSemente = (semente) => {
  ehEdit.value = true;
  sementedodialog.value = { ...semente };
  sementeDialog.value = true;
};

const editEspec = (espec) => {
  ehEdit.value = true;
  especdodialog.value = { ...espec };
  especDialog.value = true;
};

const small = ref('small');

const openNewSemente = () => {
  ehEdit.value = false;
  sementedodialog.value = {};
  submitted.value = false;
  sementeDialog.value = true;
};

const openNewEspec = () => {
  ehEdit.value = false;
  especdodialog.value = {};
  submitted.value = false;
  especDialog.value = true;
};

const sementevalido = () => {
  return sementedodialog.value.microverde !== '' &&
    sementedodialog.value.microverde !== null &&
    sementedodialog.value.fornecedor !== '' &&
    sementedodialog.value.fornecedor !== null &&
    sementedodialog.value.valorBruto !== '' &&
    sementedodialog.value.valorBruto !== null &&
    sementedodialog.value.percentualICMS !== '' &&
    sementedodialog.value.percentualICMS !== null;
};

const especvalido = () => {
  return especdodialog.value.microverde !== '' &&
    especdodialog.value.microverde !== null &&
    especdodialog.value.diasEmPilha !== '' &&
    especdodialog.value.diasEmPilha !== null &&
    especdodialog.value.blackout !== '' &&
    especdodialog.value.blackout !== null &&
    especdodialog.value.diasAteAColheita !== '' &&
    especdodialog.value.diasAteAColheita !== null &&
    especdodialog.value.gramasBandejaPlantio !== ''
    && especdodialog.value.gramasBandejaPlantio !== null;
};


const salvarNovaSemente = () => {
  submitted.value = true;
  if (sementevalido()) {
    ehEdit.value ? sementesStore.setaSemente(sementedodialog.value) : sementesStore.addSemente(sementedodialog.value);
    sementeDialog.value = false;
    sementedodialog.value = {};
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
  sementeDialog.value = false;
  sementedodialog.value = {};
};

const hideDialogEspec = () => {
  especDialog.value = false;
  especdodialog.value = {};
};

const confirmDeleteSemente = (semente) => {
  sementedodialog.value = semente;
  deleteSementeDialog.value = true;
};

const confirmDeleteEspec = (es) => {
  especdodialog.value = es;
  deleteEspecDialog.value = true;
};

const deleteSemente = () => {

  deleteSementeDialog.value = false;
  sementesStore.deletaSemente(sementedodialog.value)
  sementedodialog.value = {};
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
  { field: 'percentualICMS', header: '% ICMS' },
  { field: 'especSemente', header: 'Especificação' }
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

const achaEspec = (id) => {
  let espec = sementesStore.especSementes.find((espec) => espec.id == id);
  return espec ? espec.microverde : '';
};

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
