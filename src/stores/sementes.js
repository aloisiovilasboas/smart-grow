import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import {
  setDoc,
  collection,
  getDocs,
  getDoc,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";
import router from "../router";

export const useSementesStore = defineStore("sementes", {
  state: () => {
    const sementes = ref([]);
    const setSementes = (newvalue) => {
      sementes.value = newvalue;
    };

    return {
      sementes,
      setSementes,
    };
  },
  actions: {
    async fetchSementes() {
      const colRef = collection(db, "sementes");
      getDocs(colRef)
        .then((snapshot) => {
          this.sementes = [];
          snapshot.docs.forEach((doc) => {
            let semente = { ...doc.data(), id: doc.id };

            this.sementes.push(semente);
            ///   console.log(unovo);
            /* if (unovo.pago){
                        this.pagos = this.pagos+1
                    }
                    if (unovo.email != 'nao cadastrado'){
                        this.cadastrados = this.cadastrados+1
                    } */
          });
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
  },
});
