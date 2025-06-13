<template>
  <v-container>
    <v-card class="pa-4 mb-4">
      <h2 class="text-h5 mb-4">Responsive Example Component</h2>
      <p class="subtitle-1">
        This component demonstrates the usage of standardized responsive styles
      </p>

      <!-- Responsive Visibility Examples -->
      <div class="responsive-demo-section pa-4 mt-4">
        <h3 class="text-h6 mb-2">Responsive Visibility</h3>

        <div class="desktop-only pa-2 bg-info rounded">
          <v-icon>mdi-laptop</v-icon> This content is only visible on desktop screens
        </div>

        <div class="tablet-only pa-2 bg-success rounded mt-2">
          <v-icon>mdi-tablet</v-icon> This content is only visible on tablet screens
        </div>

        <div class="mobile-only pa-2 bg-warning rounded mt-2">
          <v-icon>mdi-cellphone</v-icon> This content is only visible on mobile screens
        </div>

        <div class="mobile-tablet-only pa-2 bg-purple rounded mt-2">
          <v-icon>mdi-devices</v-icon> This content is visible on mobile and tablet screens
        </div>

        <div class="tablet-desktop-only pa-2 bg-orange rounded mt-2">
          <v-icon>mdi-monitor-tablet</v-icon> This content is visible on tablet and desktop screens
        </div>
      </div>

      <!-- Responsive Layout Examples -->
      <div class="responsive-demo-section pa-4 mt-4">
        <h3 class="text-h6 mb-2">Responsive Layout</h3>

        <v-row class="mobile-stack">
          <v-col cols="4" class="mobile-full-width">
            <v-card class="pa-4 bg-primary">Column 1</v-card>
          </v-col>
          <v-col cols="4" class="mobile-full-width">
            <v-card class="pa-4 bg-secondary">Column 2</v-card>
          </v-col>
          <v-col cols="4" class="mobile-full-width">
            <v-card class="pa-4 bg-accent">Column 3</v-card>
          </v-col>
        </v-row>
      </div>

      <!-- Responsive Spacing Examples -->
      <div class="responsive-demo-section pa-4 mt-4">
        <h3 class="text-h6 mb-2">Responsive Spacing</h3>

        <v-card class="pa-6 mobile-reduced-padding bg-grey-lighten-3">
          <p>This card has reduced padding on mobile screens</p>
        </v-card>

        <div class="mt-6 mobile-small-text">
          <p>This text is smaller on mobile screens</p>
        </div>
      </div>

      <!-- Usage with CSS Variables -->
      <div class="responsive-demo-section pa-4 mt-4 custom-breakpoint-demo">
        <h3 class="text-h6 mb-2">Using CSS Variables for Media Queries</h3>
        <p>This section demonstrates using the CSS variables in component styles</p>
      </div>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: 'ResponsiveExampleComponent',
};
</script>

<style scoped>
.responsive-demo-section {
  border: 1px dashed #ccc;
  border-radius: 8px;
  margin-bottom: 16px;
}

.bg-info {
  background-color: rgba(33, 150, 243, 0.15);
}

.bg-success {
  background-color: rgba(76, 175, 80, 0.15);
}

.bg-warning {
  background-color: rgba(255, 152, 0, 0.15);
}

.bg-purple {
  background-color: rgba(156, 39, 176, 0.15);
}

.bg-orange {
  background-color: rgba(255, 87, 34, 0.15);
}

.rounded {
  border-radius: 4px;
}

/* Example of using the CSS variables for breakpoints */
.custom-breakpoint-demo {
  background-color: #e0f7fa;
  position: relative;
}

.custom-breakpoint-demo::after {
  content: "I'm on a desktop screen";
  position: absolute;
  right: 16px;
  top: 16px;
  background-color: #00796b;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

@media (max-width: var(--breakpoint-sm)) {
  .custom-breakpoint-demo::after {
    content: "I'm on a tablet screen";
    background-color: #7b1fa2;
  }
}

@media (max-width: var(--breakpoint-xs)) {
  .custom-breakpoint-demo::after {
    content: "I'm on a mobile screen";
    background-color: #d32f2f;
  }
}
</style>
