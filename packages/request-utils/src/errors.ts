/*
 * Copyright (c) 2025 The Ontario Institute for Cancer Research. All rights reserved
 *
 * This program and the accompanying materials are made available under the terms of
 * the GNU Affero General Public License v3.0. You should have received a copy of the
 * GNU Affero General Public License along with this program.
 *  If not, see <http://www.gnu.org/licenses/>.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT
 * SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED
 * TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS;
 * OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 * IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 * ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

export class BadRequest extends Error {
	constructor(msg: string, details?: unknown) {
		super(msg || "Sorry, looks like you sent a sent bad request. Please check the request and try again, or refer to our API documentation.");
		this.name = 'Bad Request';
		this.cause = details;
	}
}

export class NotFound extends Error {
	constructor(msg: string) {
		super(msg || "Sorry, looks like the resource you're trying to access does not exist.");
		this.name = 'Not Found';
	}
}

export class StatusConflict extends Error {
	constructor(msg: string) {
		super(msg || "Sorry, we're unable to process this request because the server has detected a conflict between the expected state of this resource and the state you attempted to apply. Please try again.");
		this.name = 'Conflict';
	}
}

export class NotImplemented extends Error {
	constructor(msg?: string) {
		super(msg || "Sorry, looks like you may have tried to access functionality which has not been implemented yet. Please try again later.");
		this.name = 'Not Implemented';
	}
}

export class ServiceUnavailable extends Error {
	constructor(msg?: string) {
		super(msg || "Sorry, this service is currently unavailable and is not able to process your request. Please try again at later time. We apologize for the inconvenience.");
		this.name = 'Service unavailable';
	}
}

export class InternalServerError extends Error {
	constructor(msg?: string) {
		super(msg || "Sorry, something went wrong. We're unable to process your request, please try again later.");
		this.name = 'Internal Server Error';
	}
}

export const getErrorMessage = (error: unknown) => {
	if (error instanceof Error) { return error.message; }
	return String(error);
};
