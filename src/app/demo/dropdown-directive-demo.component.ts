import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-dropdown-directive-demo',
  template: `
  <nav class="navbar">
    <a href="javascript:void(0);" class="logo">Home</a>
    <ul class="main-nav">
      <li class="dropdown" appDropdown>
        <a href="#" class="nav-links">Menu 1 &nbsp;<span class="caret">▼</span></a>
        <div class="dropdown-menu">
          <a href="#" class="nav-links">test 1</a>
          <a href="#" class="nav-links">test 2</a>
          <a href="#" class="nav-links">test 3</a>
        </div>
      </li>
      <li class="dropdown" appDropdown>
        <a href="#" class="nav-links">Menu 2 &nbsp;<span class="caret">▼</span></a>
        <div class="dropdown-menu">
          <a href="#" class="nav-links">test 1</a>
          <a href="#" class="nav-links">test 2</a>
          <a href="#" class="nav-links">test 3</a>
        </div>
      </li>
      <li class="dropdown" appDropdown>
        <a href="#" class="nav-links">Menu 3 &nbsp;<span class="caret">▼</span></a>
        <div class="dropdown-menu">
          <a href="#" class="nav-links">test 1</a>
          <a href="#" class="nav-links">test 2</a>
          <a href="#" class="nav-links">test 3</a>
        </div>
      </li>
    </ul>
  </nav>
  `
})
export class DropdownDirectiveDemoComponent {
  @HostBinding('class.dropdown-directive-demo') cssClass = true;
}
