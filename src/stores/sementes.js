import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import {
  setDoc,
  collection,
  getDocs,
  getDoc,
  addDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import { funcoesCRUD } from "@/services/firebaseFunctions";
import router from "../router";

export const useSementesStore = defineStore("sementes", {
  state: () => {
    const sementes = [];
    const especSementes = ref([]);
    const loadingSementes = ref(false);

    const setSementes = (newvalue) => {
      sementes.value = newvalue;
    };

    return {
      sementes,
      especSementes,
      /* setSementes, */
    };
  },
  actions: {
    async fetchSementes2() {
      loadingSementes.value = true;
      funcoesCRUD
        .fetch("sementes")
        .then((elementos) => {
          this.sementes = elementos;
          loadingSementes.value = false;
        })

        .catch((err) => {
          loadingSementes.value = false;
          console.log(err.message);
        });
    },
    async fetchSementes() {
      const colRef = collection(db, "sementes");
      getDocs(colRef)
        .then((snapshot) => {
          this.sementes = [];
          snapshot.docs.forEach((doc) => {
            let semente = { ...doc.data(), id: doc.id };

            this.sementes.push(semente);
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    async fetchEspecSementes() {
      const colRef = collection(db, "especSementes");
      getDocs(colRef)
        .then((snapshot) => {
          this.especSementes = [];
          snapshot.docs.forEach((doc) => {
            let especSemente = { ...doc.data(), id: doc.id };
            this.especSementes.push(especSemente);
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    /* async fetchEspecSementes2() {
      const colRef = collection(db, "especSementes");
      getDocs(colRef)
        .then((snapshot) => {
          const helper = [];
          this.especSementes = [];
          snapshot.docs.forEach((doc) => {
            let especSemente = { ...doc.data(), id: doc.id };

            helper.push(especSemente);
            const columns = [];
            helper.forEach((espec) => {
              for (const property in espec) {
                //  console.log(`${property}: ${espec[property]}`);
                if (property != "id") {
                  columns.push({ header: property, field: espec[property] });
                }
              }
              this.especSementes.push({ id: espec.id, columns: columns });
            });
            console.log(this.especSementes);
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    }, */
    async setaEspecSemente(e) {
      try {
        const docref = doc(db, "especSementes", e.id);
        await updateDoc(docref, e).then(() => {
          let index = this.especSementes.findIndex((es) => e.id == es.id);
          this.especSementes[index] = e;
          /* this.especSementes.sort((a, b) =>
            a.microverde > b.microverde ? 1 : -1
          ); */
        });
      } catch (e) {
        alert("Erro alterando especificacao de semente: ", e);
        console.error("Erro alterando especificacao de semente: ", e);
      }
    },
    async deletaEspecSemente(especSemente) {
      try {
        const docRef = doc(db, "especSementes", especSemente.id);
        await deleteDoc(docRef) /* .then(() => {
          let index = this.especSementes.findIndex(
            (es) => es.id == especSemente.id
          );
          this.especSementes.splice(index, 1);
        }) */;
      } catch (e) {
        alert("Erro deletando especificacao de semente: ", e);
        console.error("Erro deletando especificacao de semente: ", e);
      }
    },

    async salvaNovaEspecSemente(es) {
      try {
        const docRef = await addDoc(
          collection(db, "especSementes"),
          es
        ); /* .then(
          () => {
            this.especSementes.push(es);
            
          } 
        )*/
      } catch (e) {
        alert("Erro adicionando especificacao de semente: ", e);
        console.error("Erro adicionando especificacao de semente: ", e);
      }
    },
  },
});
