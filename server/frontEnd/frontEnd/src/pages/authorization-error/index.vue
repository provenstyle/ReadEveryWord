<script setup lang="ts">
import { useAuth0 } from '@auth0/auth0-vue'

const auth = useAuth0()

const logout = async () => {
  await auth.logout({
    logoutParams: {
      returnTo: window.location.origin
    }
  })
}

const signIn = async () => {
  await auth.loginWithRedirect({
    appState: {
      target: '/'
    }
  })
}

</script>

<template>
  <div class="text-center mt-8">
    <h1>Authorization Error</h1>
    <p class="mb-4">
      {{ auth.error }}
    </p>
    <v-btn
      class="mr-4"
      variant="outlined"
      @click="signIn"
    >
      Sign In
    </v-btn>

    <v-btn
      append-icon="mdi-logout"
      variant="outlined"
      @click="logout"
    >
      Log Out
    </v-btn>
  </div>
</template>
