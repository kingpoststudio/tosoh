<script lang="ts">
  import { constructCDNUrl } from '../../utils/utils';
  import type { PortaleEmogiobineItem } from '../../../types/portaleEmogiobine';
  let { item }: { item: PortaleEmogiobineItem } = $props();

  const {
    advice,
    anomaly,
    attachment_1,
    attachment_2,
    attachment_3,
    attachment_4,
    blood_count,
    diagnosis,
    ethnicity,
    hemoglobin_status,
    history,
    name,
    other,
    other_diagnosis,
    patient_dob,
    sex,
    summary,
  } = item?.values;

  const schema = [
    { label: 'Sesso', value: sex.label },
    { label: 'Data di nascita paziente (gg/mm/00)', value: patient_dob },
    { label: "Eventuali informazioni sull'etnia", value: ethnicity },
    { label: 'Anamnesi', value: history },
    { label: 'Eventuali anomalie nelle indagini svolte', value: anomaly },
    { label: 'Emocromo', value: blood_count },
    { label: 'Assetto emoglobinico', value: hemoglobin_status },
    { label: 'Altro', value: other },
    { label: 'Diagnosi', value: diagnosis },
    { label: 'Altro', value: other_diagnosis },
    { label: 'Consigliare', value: advice },
  ];
</script>

{#snippet renderAttachment(attachment: any)}
  <img
    class="max-h-[36rem] object-contain"
    src={constructCDNUrl(attachment.url, 400)}
    alt={attachment.altText}
  />
{/snippet}

<div
  class={`border-border relative flex h-full w-full flex-col content-around gap-[1.25rem] rounded-2xl border p-[1.25rem]`}
>
  <div class="gap-sm flex h-full w-full flex-col justify-between">
    <div class="gap-sm flex-col items-center">
      <tosoh-modal variant="action" modalId={name} width="fit-content">
        <h5
          class="break-word hover:text-imperial-red text-raisin-black font-sans-narrow cursor-pointer font-semibold transition-all duration-200"
        >
          {@html name}
        </h5>
      </tosoh-modal>
    </div>
    <div>
      {@html summary}
      <tosoh-modal variant="modal" modalId={name}>
        <div slot="title" class="w-full"><h2 class="text-4xl">{name}</h2></div>
        <div slot="content">
          <div class="space-y-xs flex flex-col">
            <div class="text-xl font-semibold italic">{@html summary}</div>

            <div class="relative overflow-auto">
              <div class="my-md overflow-hidden rounded-t-lg">
                <table class="w-full table-auto border-collapse text-sm">
                  <thead>
                    <tr class="bg-zinc-700 text-white">
                      <th class="p-base border-b text-left font-bold">Proprietà</th>
                      <th class="p-base border-b text-left font-bold">Valore</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white">
                    {#each schema as col}
                      <tr class="border-b border-zinc-200">
                        <td class="p-base">{col.label}</td>
                        <td class="p-base">{@html col.value}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
                <div class="mt-sm gap-sm flex flex-col flex-wrap">
                  <h5>Allegati</h5>
                  <p>Clicca su un'immagine per vedere di più.</p>
                  <hr />
                  <div class="gap-sm flex">
                    {#if attachment_1}
                      {@render renderAttachment(attachment_1)}
                    {/if}
                    {#if attachment_2}
                      {@render renderAttachment(attachment_2)}
                    {/if}
                    {#if attachment_3}
                      {@render renderAttachment(attachment_3)}
                    {/if}
                    {#if attachment_4}
                      {@render renderAttachment(attachment_4)}
                    {/if}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </tosoh-modal>
    </div>
  </div>
</div>
