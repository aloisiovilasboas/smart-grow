<script setup>
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
//import TheWelcome from '../components/TheWelcome.vue'

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';   // optional
import Row from 'primevue/row';                   // optional



import { useSementesStore } from "../stores/sementes";
import { onMounted, onBeforeMount, ref } from 'vue';


const sementesStore = useSementesStore();

const sementes = ref({});

onBeforeMount(() => {

    sementesStore.fetchSementes();
    sementes.value = sementesStore.sementes;

});


</script>

<template>
    <main>
        <!--  <div>
            <h1><img src="../assets/cultiveselogo.webp" height="250"></h1>
        </div> -->
        <div class="admin">
            <TabView>
                <TabPanel header="Sementes">
                    <!-- Tabela com a lista de sementes -->
                    <DataTable :value="sementesStore.sementes" :paginator="true" :rows="10"
                        :rowsPerPageOptions="[5, 10, 20]">
                        <Column field="microverde" header="Microverde"></Column>
                        <Column field="fornecedor" header="Fornecedor"></Column>
                        <Column field="valorBruto" header="Preço"></Column>
                        <Column field="percentualICMS" header="% ICMS"></Column>
                    </DataTable>
                </TabPanel>
                <TabPanel header="Header II">
                    <p class="m-0">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                        laudantium, totam rem
                        aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt
                        explicabo.
                        Nemo
                        enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur
                        magni dolores eos
                        qui ratione voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius
                        modi.
                    </p>
                </TabPanel>
                <TabPanel header="Header III">
                    <p class="m-0">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum
                        deleniti
                        atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident,
                        similique
                        sunt in
                        culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum
                        facilis est
                        et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil
                        impedit quo
                        minus.
                    </p>
                </TabPanel>
                <TabPanel header="Header IV" :disabled="true"></TabPanel>
            </TabView>
        </div>
    </main>
</template>
<style>
@media (min-width: 1024px) {
    .admin {
        min-height: 100vh;
        display: flex;
        align-items: center;
    }
}
</style>