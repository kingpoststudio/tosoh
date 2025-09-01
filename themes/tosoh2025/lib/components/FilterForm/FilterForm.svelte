<script lang="ts">
  import type { FormManagerInstance } from '../../utils/formManager';

  let { type }: { type: 'change' } = $props();

  let formElement: HTMLFormElement | null = $state(null);
  let formManager: FormManagerInstance | null = $state(null);
</script>
