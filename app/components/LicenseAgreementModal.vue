<template>
  <Teleport to="body">
    <Transition name="fade">
      <div v-if="isVisible" class="agreement-overlay">
        <div class="agreement-card">
          <div class="agreement-header">
            <h3>Verscape License Agreement</h3>
            <button class="close-btn" @click="$emit('close')">&times;</button>
          </div>

          <div class="agreement-body">
            <p class="intro">
              This License Agreement (“Agreement”) is entered into between
              Verscape Technology Ltd. (“Verscape”) and you, or the organization
              on whose behalf you act (“Licensee”). By downloading or purchasing
              any Audio Asset from Verscape, you agree to the terms of this
              Agreement.
            </p>

            <div class="section">
              <h4>1. Definitions</h4>
              <p>
                <strong>Audio Asset:</strong> Music, soundtrack, background
                music, sound effect, loop, stem, or other audio file available
                through Verscape.
              </p>
              <p>
                <strong>Production:</strong> Any media project in which an Audio
                Asset is synchronized or integrated, including games, video,
                film, streaming, advertisements, podcasts, applications,
                websites, and commercial client work.
              </p>
              <p>
                <strong>Commercial Use:</strong> Any use intended for
                monetization, promotion, advertising, business use, or
                distribution to the public.
              </p>
              <p>
                <strong>Social Media Platforms:</strong> YouTube, TikTok,
                Twitch, Bilibili, Instagram, Facebook, and equivalent platforms.
              </p>
              <p>
                <strong>PRO-Free Asset:</strong> An Audio Asset marked as not
                requiring public performance royalties.
              </p>
            </div>

            <div class="section">
              <h4>2. License Grant</h4>
              <p>
                Upon one-time purchase, Verscape grants the Licensee a
                worldwide, perpetual, non-exclusive, non-transferable license
                to:
              </p>
              <ul>
                <li>
                  download, edit, modify, remix, synchronize, and use the Audio
                  Asset,
                </li>
                <li>
                  use the Audio Asset in unlimited Productions and unlimited
                  client projects, personal or commercial.
                </li>
              </ul>
              <p>
                You do not obtain ownership or copyright of the Audio Asset.
              </p>
              <p>
                Preview files may only be used for evaluation and may not be
                published or distributed.
              </p>
            </div>

            <div class="section">
              <h4>3. Permitted Uses</h4>
              <p>The Licensee may use the Audio Asset in:</p>
              <ul>
                <li>Games (mobile, PC, console)</li>
                <li>Videos, corporate content, and advertising</li>
                <li>Streaming, short-video, and social media</li>
                <li>Film, animation, and visual projects</li>
                <li>Client work and commercial contracts</li>
                <li>Websites, apps, podcasts, events, and exhibitions</li>
              </ul>
              <p>
                There are no restrictions on distribution territory, number of
                clients, or number of productions.
              </p>
            </div>

            <div class="section">
              <h4>4. Restrictions</h4>
              <p>The Licensee may NOT:</p>
              <ul>
                <li>
                  resell, re-license, transfer, or redistribute the Asset as a
                  standalone file,
                </li>
                <li>
                  make the Asset available for download or extraction by third
                  parties,
                </li>
                <li>
                  use the Asset in any competing catalog, template, or sound
                  library,
                </li>
                <li>claim ownership or authorship of the Asset,</li>
                <li>
                  register the Asset in any fingerprinting or Content ID system,
                </li>
                <li>use the Asset for AI or machine learning training.</li>
              </ul>
              <p>All use must be synchronized into a Production.</p>
            </div>

            <div class="section">
              <h4>5. Ownership</h4>
              <p>
                Verscape retains all rights, title, and intellectual property in
                the Audio Asset. The Licensee receives only usage rights under
                this Agreement. Verscape may continue licensing the same Audio
                Asset to other third parties.
              </p>
            </div>

            <div class="section">
              <h4>6. Public Performance</h4>
              <p>
                Unless labeled PRO-Free, public performance rights are excluded.
                The Licensee is responsible for compliance with any reporting or
                rights organizations.
              </p>
            </div>

            <div class="section">
              <h4>7. No Refund Policy</h4>
              <p>
                All purchases are final and non-refundable. Once the Audio Asset
                has been purchased or downloaded, no refund, return, exchange,
                or cancellation is permitted under any circumstances.
              </p>
            </div>

            <div class="section">
              <h4>8. Limitation of Liability</h4>
              <p>
                Verscape makes no guarantee that the Asset will meet your
                specific project requirements. The total liability of Verscape
                shall not exceed the purchase price of the Asset.
              </p>
            </div>

            <div class="section">
              <h4>9. Availability and Takedown</h4>
              <p>
                Verscape may require removal of an Asset if legal claims arise.
                Verscape may, at its discretion, provide a replacement Asset at
                no additional cost.
              </p>
            </div>

            <div class="section">
              <h4>10. Taxes</h4>
              <p>
                Purchase price excludes applicable taxes or government charges.
              </p>
            </div>

            <div class="section">
              <h4>11. Governing Law</h4>
              <p>
                This Agreement is governed by the laws of British Columbia,
                Canada. If any clause is held unenforceable, the remainder of
                the Agreement remains in effect.
              </p>
            </div>
          </div>

          <div class="agreement-footer">
            <button class="agree-btn" @click="$emit('confirm')">Agree</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  isVisible: boolean;
}>();

const emit = defineEmits(["close", "confirm"]);
</script>

<style scoped>
.agreement-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000; /* 比 CheckoutModal 高 */
  backdrop-filter: blur(2px);
}

.agreement-card {
  width: 90%;
  max-width: 700px;
  background-color: #1a1a2e;
  border: 1px solid #333;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  max-height: 85vh;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.agreement-header {
  padding: 20px;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.agreement-header h3 {
  margin: 0;
  color: #fff;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  color: #888;
  font-size: 1.5rem;
  cursor: pointer;
}

.agreement-body {
  padding: 20px;
  overflow-y: auto;
  flex-grow: 1;
  color: #ccc;
  font-size: 0.95rem;
  line-height: 1.6;
}

.section {
  margin-bottom: 20px;
}

.section h4 {
  color: #ff8c62;
  margin-bottom: 10px;
  font-size: 1.1rem;
}

ul {
  padding-left: 20px;
  margin: 10px 0;
}

li {
  margin-bottom: 5px;
}

.agreement-footer {
  padding: 20px;
  border-top: 1px solid #333;
  text-align: center;
}

.agree-btn {
  background-color: #ff8c62;
  color: #0d0d1a;
  border: none;
  padding: 10px 40px;
  border-radius: 25px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.agree-btn:hover {
  background-color: #e67a54;
}

/* Scrollbar styling */
.agreement-body::-webkit-scrollbar {
  width: 8px;
}
.agreement-body::-webkit-scrollbar-track {
  background: #111;
}
.agreement-body::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 4px;
}
.agreement-body::-webkit-scrollbar-thumb:hover {
  background: #666;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
