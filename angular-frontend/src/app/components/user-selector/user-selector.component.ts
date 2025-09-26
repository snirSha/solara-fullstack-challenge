import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserContextService } from '../../services/user-context.service';

@Component({
  selector: 'app-user-selector',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './user-selector.component.html',
  styleUrls: ['./user-selector.component.scss']
})
export class UserSelectorComponent implements OnInit {
  users = [
    { id: 'user1', name: 'Alice' },
    { id: 'user2', name: 'Bob' },
    { id: 'user3', name: 'Charlie' }
  ];

  selectedUserId: string = '';

  constructor(private userContext: UserContextService, private router: Router) {}


  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (userId) {
      this.router.navigate(['/']);
    }
  }

  enterApp(): void {
    localStorage.setItem('userId', this.selectedUserId);
    this.router.navigate(['/app/campaigns']);
  }

  onUserSelect(userId: string): void {
    this.selectedUserId = userId;
    this.userContext.setUser(userId); // ← כאן אתה קורא ל־setUser
    this.router.navigate(['/']); // או טוען מחדש את הקמפיינים
  }

}
