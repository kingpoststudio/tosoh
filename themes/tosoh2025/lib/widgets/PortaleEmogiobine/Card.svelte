<script lang="ts">
  import { constructCDNUrl } from '../../utils/utils';
  import type { PortaleEmogiobineItem } from '../../../types/hubdb';
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
      <h5 class="break-word text-raisin-black font-sans-narrow font-semibold">
        {@html name}
      </h5>
    </div>
    <div>
      {@html summary}
    </div>

    <div class="flex flex-col">
      <tosoh-modal variant="action" modalId={name}>
        <button class="gap-sm w-full! mt-sm flex items-center justify-center text-center">
          {@html name}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="14"
            viewBox="0 0 12 14"
            fill="none"
            class="h-3 w-3 min-w-[1rem]"
          >
            <path
              d="M0.629487 12.2917C0.363957 12.6236 0.417771 13.1079 0.749684 13.3734C1.0816 13.639 1.56592 13.5852 1.83145 13.2532L1.23047 12.7725L0.629487 12.2917ZM11.231 1.14299C11.184 0.720533 10.8035 0.416117 10.3811 0.463057L3.49674 1.22798C3.07428 1.27492 2.76987 1.65544 2.81681 2.0779C2.86375 2.50035 3.24427 2.80477 3.66672 2.75783L9.78612 2.0779L10.4661 8.19729C10.513 8.61975 10.8935 8.92417 11.316 8.87723C11.7384 8.83029 12.0428 8.44977 11.9959 8.02731L11.231 1.14299ZM1.23047 12.7725L1.83145 13.2532L11.067 1.70877L10.4661 1.22798L9.86507 0.747196L0.629487 12.2917L1.23047 12.7725Z"
              fill="white"
            />
          </svg>
        </button>
      </tosoh-modal>

      <tosoh-modal variant="modal" modalId={name}>
        <div slot="title" class="w-full"><h2 class="text-4xl">{name}</h2></div>
        <div slot="content">
          <div class="flex flex-col space-y-2">
            <div class="text-xl font-semibold italic">{@html summary}</div>

            <div class="relative overflow-auto">
              <div class="my-8 overflow-hidden rounded-t-lg">
                <table class="w-full table-auto border-collapse text-sm">
                  <thead>
                    <tr class="bg-zinc-700 text-white">
                      <th class="border-b p-4 text-left font-bold">Proprietà</th>
                      <th class="border-b p-4 text-left font-bold">Valore</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white">
                    {#each schema as col}
                      <tr class="border-b border-zinc-200">
                        <td class="p-4">{col.label}</td>
                        <td class="p-4">{@html col.value}</td>
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
